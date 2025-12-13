/*
////////////////////////////////////////////////
             MOS 6502 CPU Emulator
                Made by mpax235
 ---------------------------------------------
        Licensed under the MIT license.
////////////////////////////////////////////////
*/

const CPU = {
    // registers
    A: 0x00,
    X: 0x00,
    Y: 0x00,
    PC: 0x0000,
    SP: 0xFD,

    // more flags
    halted: false,

    memory: new Uint8Array(65536),
    flags: {
        carry: false,
        zero: false,
        interrupt: false,
        decimal: false,
        break: false,
        overflow: false,
        negative: false
    }
};

// cpu execution functions
function resetCPU() {
    const lo = CPU.memory[0xFFFC];
    const hi = CPU.memory[0xFFFD];
    CPU.PC = (hi << 8) | lo;

    CPU.flags.interrupt = false;
    CPU.flags.decimal = false;
    CPU.flags.break = false;

    CPU.SP = 0xFD;

    CPU.halted = false;
}

// opcode helpers
function getStatusByte() {
    return (
        (CPU.flags.negative << 7) |
        (CPU.flags.overflow << 6) |
        (1 << 5) |
        (1 << 4) |
        (CPU.flags.decimal << 3) |
        (CPU.flags.interrupt << 2) |
        (CPU.flags.zero << 1) |
        (CPU.flags.carry)
    );
}

function branchIf(condition, offset) {
    if (condition) {
        const signedOffset = (offset & 0x80) ? offset - 0x100 : offset;
        CPU.PC = (CPU.PC + signedOffset) & 0xFFFF;
    }
}

function readImmediate() {
    return CPU.memory[CPU.PC++];
}

function readAbsolute() {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    return (hi << 8) | lo;
}

// index functions
function readAbsoluteX() {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const addr = ((hi << 8) | lo) + CPU.X;
    return CPU.memory[addr & 0xFFFF];
}

function readAbsoluteY() {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const addr = ((hi << 8) | lo) + CPU.Y;
    return CPU.memory[addr & 0xFFFF];
}

function readIndirectX() {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    return CPU.memory[addr];
}

function readIndirectY() {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    return CPU.memory[addr & 0xFFFF];
}

function readZeroPageX() {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    return CPU.memory[addr];
}

function readZeroPageY() {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.Y) & 0xFF;
    return CPU.memory[addr];
}

// set up necessary stuff
const VECTORS = {
    NMI: 0xFFFA,
    RESET: 0xFFFC,
    IRQ: 0xFFFE
}

const opcodeMap = {
    0x00: BRK,
    0x01: () => ORA(readIndirectX()),
    0x05: () => ORA(CPU.memory[CPU.memory[CPU.PC++]]),
    0x06: () => ASL(CPU.memory[CPU.memory[CPU.PC++]]),
    0x08: PHP,
    0x09: () => ORA(readImmediate()),
    0x0A: () => { CPU.A = ASL(CPU.A); },
    0x0D: () => ORA(CPU.memory[readAbsolute()]),
    0x0E: () => ASL(CPU.memory[readAbsolute()]),
    0x10: () => BPL(readImmediate()),
    0x11: () => ORA(readIndirectY()),
    0x15: () => ORA(readZeroPageX()),
    0x16: () => ASL(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x18: CLC,
    0x19: () => ORA(CPU.memory[readAbsoluteY()]),
    0x1D: () => ORA(CPU.memory[readAbsoluteX()]),
    0x1E: () => ASL(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),
    0x20: () => JSR(readAbsolute()),
    0x21: () => AND(readIndirectX()),
    0x24: () => BIT(CPU.memory[CPU.memory[CPU.PC++]]),
    0x25: () => AND(CPU.memory[CPU.memory[CPU.PC++]]),
    0x26: () => ROL(CPU.memory[CPU.memory[CPU.PC++]]),
    0x28: PLP,
    0x29: () => AND(readImmediate()),
    0x2A: () => { CPU.A = ROL(CPU.A); },
    0x2C: () => BIT(CPU.memory[readAbsolute()]),
    0x2D: () => AND(CPU.memory[readAbsolute()]),
    0x2E: () => ROL(CPU.memory[readAbsolute()]),
    0x30: () => BMI(readImmediate()),
    0x31: () => AND(readIndirectY()),
    0x35: () => AND(readZeroPageX()),
    0x36: () => ROL(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x38: SEC,
    0x39: () => AND(CPU.memory[readAbsoluteY()]),
    0x3D: () => AND(CPU.memory[readAbsoluteX()]),
    0x3E: () => ROL(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),
    0x40: RTI,
    0x41: () => EOR(readIndirectX()),
    0x46: () => LSR(CPU.memory[CPU.memory[CPU.PC++]]),
    0x48: PHA,
    0x49: () => EOR(readImmediate()),
    0x4A: () => { CPU.A = LSR(CPU.A); },
    0x4C: () => JMP(readAbsolute()),
    0x4E: () => LSR(CPU.memory[readAbsolute()]),
    0x50: () => BVC(readImmediate()),
    0x51: () => EOR(readIndirectY()),
    0x55: () => EOR(readZeroPageX()),
    0x56: () => LSR(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x58: CLI,
    0x59: () => EOR(CPU.memory[readAbsoluteY()]),
    0x5D: () => EOR(CPU.memory[readAbsoluteX()]),
    0x5E: () => LSR(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),
    0x60: RTS,
    0x61: () => ADC(readIndirectX()),
    0x65: () => ADC(CPU.memory[CPU.memory[CPU.PC++]]),
    0x66: () => ROR(CPU.memory[CPU.memory[CPU.PC++]]),
    0x68: PLA,
    0x69: () => ADC(readImmediate()),
    0x6A: () => { CPU.A = ROR(CPU.A); },
    0x6E: () => ROR(CPU.memory[readAbsolute()]),
    0x70: () => BVS(readImmediate()),
    0x71: () => ADC(readIndirectY()),
    0x75: () => ADC(readZeroPageX()),
    0x76: () => ROR(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x78: SEI,
    0x79: () => ADC(CPU.memory[readAbsoluteY()]),
    0x7D: () => ADC(CPU.memory[readAbsoluteX()]),
    0x7E: () => ROR(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),
    0x84: () => STY(CPU.memory[CPU.PC++]),
    0x85: () => STA(CPU.memory[CPU.PC++]),
    0x86: () => STX(CPU.memory[CPU.PC++]),
    0x88: DEY,
    0x8A: TXA,
    0x8C: () => STY(readAbsolute()),
    0x8D: () => STA(readAbsolute()),
    0x8E: () => STX(readAbsolute()),
    0x90: () => BCC(readImmediate()),
    0x94: () => STY(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x95: () => STA(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0x96: () => STX(CPU.memory[CPU.memory[CPU.PC++] + CPU.Y & 0xFF]),
    0x98: TYA,
    0x99: () => STA((readAbsolute() + CPU.Y) & 0xFFFF),
    0x9A: TXS,
    0x9D: () => STA((readAbsolute() + CPU.X) & 0xFFFF),
    0xA0: () => LDY(readImmediate()),
    0xA1: () => LDA(readIndirectX()),
    0xA2: () => LDX(readImmediate()),
    0xA4: () => LDY(CPU.memory[CPU.memory[CPU.PC++]]),
    0xA5: () => LDA(CPU.memory[CPU.memory[CPU.PC++]]),
    0xA6: () => LDX(CPU.memory[CPU.memory[CPU.PC++]]),
    0xA8: TAY,
    0xA9: () => LDA(readImmediate()),
    0xAA: TAX,
    0xAC: () => LDY(CPU.memory[readAbsolute()]),
    0xAD: () => LDA(CPU.memory[readAbsolute()]),
    0xAE: () => LDX(CPU.memory[readAbsolute()]),
    0xB0: () => BCS(readImmediate()),
    0xB1: () => LDA(readIndirectY()),
    0xB4: () => LDY(readZeroPageX()),
    0xB5: () => LDA(readZeroPageX()),
    0xB6: () => LDX(readZeroPageY()),
    0xB8: CLV,
    0xB9: () => LDA(CPU.memory[readAbsoluteY()]),
    0xBA: TSX,
    0xBC: () => LDY(CPU.memory[readAbsoluteX()]),
    0xBD: () => LDA(CPU.memory[readAbsoluteX()]),
    0xBE: () => LDX(CPU.memory[readAbsoluteY()]),
    0xC1: () => CMP(readIndirectX()),
    0xC5: () => CMP(CPU.memory[CPU.memory[CPU.PC++]]),
    0xC6: () => DEC(CPU.memory[CPU.memory[CPU.PC++]]),
    0xC8: INY,
    0xC9: () => CMP(readImmediate()),
    0xCA: DEX,
    0xCD: () => CMP(CPU.memory[readAbsolute()]),
    0xD0: () => BNE(readImmediate()),
    0xD1: () => CMP(readIndirectY()),
    0xD5: () => CMP(readZeroPageX()),
    0xD6: () => DEC(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0xD8: CLD,
    0xD9: () => CMP(CPU.memory[readAbsoluteY()]),
    0xDD: () => CMP(CPU.memory[readAbsoluteX()]),
    0xDE: () => DEC(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),
    0xE1: () => SBC(readIndirectX()),
    0xE5: () => SBC(CPU.memory[CPU.memory[CPU.PC++]]),
    0xE6: () => INC(CPU.memory[CPU.memory[CPU.PC++]]),
    0xE8: INX,
    0xE9: () => SBC(readImmediate()),
    0xEA: NOP,
    0xED: () => SBC(CPU.memory[readAbsolute()]),
    0xF0: () => BEQ(readImmediate()),
    0xF1: () => SBC(readIndirectY()),
    0xF5: () => SBC(readZeroPageX()),
    0xF6: () => INC(CPU.memory[CPU.memory[CPU.PC++] + CPU.X & 0xFF]),
    0xF8: SED,
    0xF9: () => SBC(CPU.memory[readAbsoluteY()]),
    0xFD: () => SBC(CPU.memory[readAbsoluteX()]),
    0xFE: () => INC(CPU.memory[readAbsolute() + CPU.X & 0xFFFF]),

    // illegal opcodes
    0x0B: () => ANC(readImmediate()),
    0x2B: () => ANC(readImmediate()),
    0x4B: () => ALR(readImmediate()),
    0x6B: () => ARR(readImmediate()),
    0x8B: () => ANE(readImmediate()),
    0xAB: () => LXA(readImmediate()),
    0xCB: () => SBX(readImmediate()),
    0xEB: () => SBC(readImmediate()),
};

opcodeMap[0x03] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    SLO(addr);
};

opcodeMap[0x07] = () => {
    const addr = CPU.memory[CPU.PC++];
    SLO(addr);
};

opcodeMap[0x0F] = () => {
    const addr = readAbsolute();
    SLO(addr);
};

opcodeMap[0x13] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    SLO(addr & 0xFFFF);
};

opcodeMap[0x17] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    SLO(addr);
}

opcodeMap[0x1B] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    SLO(addr);
};

opcodeMap[0x1F] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    SLO(addr);
};

opcodeMap[0x23] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    RLA(addr);
};

opcodeMap[0x27] = () => {
    const addr = CPU.memory[CPU.PC++];
    RLA(addr);
};

opcodeMap[0x2F] = () => {
    const addr = readAbsolute();
    RLA(addr);
};

opcodeMap[0x33] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    RLA(addr & 0xFFFF);
};

opcodeMap[0x37] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    RLA(addr);
};

opcodeMap[0x3B] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    RLA(addr);
};

opcodeMap[0x3F] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    RLA(addr);
};

opcodeMap[0x43] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    SRE(addr);
};

opcodeMap[0x47] = () => {
    const addr = CPU.memory[CPU.PC++];
    SRE(addr);
};

opcodeMap[0x4F] = () => {
    const addr = readAbsolute();
    SRE(addr);
};

opcodeMap[0x51] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    const value = CPU.memory[addr & 0xFFFF];
    EOR(value);
};

opcodeMap[0x53] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    SRE(addr & 0xFFFF);
};

opcodeMap[0x57] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    SRE(addr);
};

opcodeMap[0x5B] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    SRE(addr);
};

opcodeMap[0x5F] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    SRE(addr);
};

opcodeMap[0x63] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    RRA(addr);
}

opcodeMap[0x67] = () => {
    const addr = CPU.memory[CPU.PC++];
    RRA(addr);
};

opcodeMap[0x6F] = () => {
    const addr = readAbsolute();
    RRA(addr);
};

opcodeMap[0x73] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    RRA(addr & 0xFFFF);
};

opcodeMap[0x77] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    RRA(addr);
};

opcodeMap[0x7B] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    RRA(addr);
};

opcodeMap[0x7F] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    RRA(addr);
};

opcodeMap[0x81] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    STA(addr);
};

opcodeMap[0x83] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    SAX(addr);
};

opcodeMap[0x87] = () => {
    const addr = CPU.memory[CPU.PC++];
    SAX(addr);
};

opcodeMap[0x8F] = () => {
    const addr = readAbsolute();
    SAX(addr);
};

opcodeMap[0x91] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    STA(addr & 0xFFFF);
};

opcodeMap[0x93] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const base = (hi << 8) | lo;
    const addr = (base + CPU.Y) & 0xFFFF;
    SHA(addr, hi);
};

opcodeMap[0x97] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.Y) & 0xFF;
    SAX(addr);
};

opcodeMap[0x9B] = () => {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const base = (hi << 8) | lo;
    const addr = (base + CPU.Y) & 0xFFFF;
    TAS(addr, hi);
};

opcodeMap[0x9C] = () => {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const base = (hi << 8) | lo;
    const addr = (base + CPU.X) & 0xFFFF;
    SHY(addr, hi);
};

opcodeMap[0x9E] = () => {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const base = (hi << 8) | lo;
    const addr = (base + CPU.Y) & 0xFFFF;
    SHX(addr, hi);
};

opcodeMap[0x9F] = () => {
    const lo = CPU.memory[CPU.PC++];
    const hi = CPU.memory[CPU.PC++];
    const base = (hi << 8) | lo;
    const addr = (base + CPU.Y) & 0xFFFF;
    SHA(addr, hi);
};

opcodeMap[0xA3] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    LAX(CPU.memory[addr]);
};

opcodeMap[0xA7] = () => {
    const addr = CPU.memory[CPU.PC++];
    LAX(CPU.memory[addr]);
};

opcodeMap[0xAF] = () => {
    const addr = readAbsolute();
    LAX(CPU.memory[addr]);
};

opcodeMap[0xB3] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    LAX(CPU.memory[addr & 0xFFFF]);
};

opcodeMap[0xB7] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.Y) & 0xFF;
    LAX(CPU.memory[addr]);
};

opcodeMap[0xBB] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    LAS(addr);
};

opcodeMap[0xBF] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    LAX(CPU.memory[addr]);
};

opcodeMap[0xC3] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    DCP(addr);
};

opcodeMap[0xC7] = () => {
    const addr = CPU.memory[CPU.PC++];
    DCP(addr);
};

opcodeMap[0xCF] = () => {
    const addr = readAbsolute();
    DCP(addr);
};

opcodeMap[0xD3] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    DCP(addr & 0xFFFF);
};

opcodeMap[0xD7] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    DCP(addr);
};

opcodeMap[0xDB] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    DCP(addr);
};

opcodeMap[0xDF] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    DCP(addr);
};

opcodeMap[0xE3] = () => {
    const zp = (CPU.memory[CPU.PC++] + CPU.X) & 0xFF;
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = (hi << 8) | lo;
    ISC(addr);
};

opcodeMap[0xE7] = () => {
    const addr = CPU.memory[CPU.PC++];
    ISC(addr);
};

opcodeMap[0xEF] = () => {
    const addr = readAbsolute();
    ISC(addr);
};

opcodeMap[0xF3] = () => {
    const zp = CPU.memory[CPU.PC++];
    const lo = CPU.memory[zp];
    const hi = CPU.memory[(zp + 1) & 0xFF];
    const addr = ((hi << 8) | lo) + CPU.Y;
    ISC(addr & 0xFFFF);
};

opcodeMap[0xF7] = () => {
    const base = CPU.memory[CPU.PC++];
    const addr = (base + CPU.X) & 0xFF;
    ISC(addr);
};

opcodeMap[0xFB] = () => {
    const addr = (readAbsolute() + CPU.Y) & 0xFFFF;
    ISC(addr);
};

opcodeMap[0xFF] = () => {
    const addr = (readAbsolute() + CPU.X) & 0xFFFF;
    ISC(addr);
};

[0x1A, 0x3A, 0x5A, 0x7A, 0xDA, 0xFA].forEach(op => {
    opcodeMap[op] = NOP;
});

const JAM_OPCODES = [
    0x02, 0x12, 0x22, 0x32,
    0x42, 0x52, 0x62, 0x72,
    0x92, 0xB2, 0xD2, 0xF2
];

// cpu instructions
function ADC(value) {
    const carryIn = CPU.flags.carry ? 1 : 0;
    const result = CPU.A + value + carryIn;

    CPU.flags.carry = result > 0xFF;
    CPU.flags.zero = (result & 0xFF) === 0;
    CPU.flags.negative = (result & 0x80) !== 0;
    CPU.flags.overflow = (~(CPU.A ^ value) & (CPU.A ^ result) & 0x80) !== 0;

    CPU.A = result & 0xFF;
}

function AND(value) {
    CPU.A = CPU.A & value;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function ASL(value) {
    const result = (value << 1) & 0xFF;
    CPU.flags.carry = (value & 0x80) !== 0;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
    return result;
}

function BCC(offset) {
    branchIf(!CPU.flags.carry, offset);
}

function BCS(offset) {
    branchIf(CPU.flags.carry, offset);
}

function BEQ(offset) {
    branchIf(CPU.flags.zero, offset);
}

function BIT(value) {
    const result = CPU.A & value;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (value & 0x80) !== 0;
    CPU.flags.overflow = (value & 0x40) !== 0;
}

function BMI(offset) {
    branchIf(CPU.flags.negative, offset);
}

function BNE(offset) {
    branchIf(!CPU.flags.zero, offset);
}

function BPL(offset) {
    branchIf(!CPU.flags.negative, offset);
}

function BRK() {
    const returnAddress = (CPU.PC + 1) & 0xFFFF;

    CPU.memory[0x0100 + CPU.SP] = (returnAddress >> 8) & 0xFF;
    CPU.SP = (CPU.SP - 1) & 0xFF;

    CPU.memory[0x0100 + CPU.SP] = returnAddress & 0xFF;
    CPU.SP = (CPU.SP - 1) & 0xFF;

    const status = getStatusByte() | 0x10;
    CPU.memory[0x0100 + CPU.SP] = status;
    CPU.SP = (CPU.SP - 1) & 0xFF;

    CPU.flags.interrupt = true;

    const lo = CPU.memory[0xFFFE];
    const hi = CPU.memory[0xFFFF];
    CPU.PC = (hi << 8) | lo;
}

function BVC(offset) {
    branchIf(!CPU.flags.overflow, offset);
}

function BVS(offset) {
    branchIf(CPU.flags.overflow, offset);
}

function CLC() {
    CPU.flags.carry = false;
}

function CLD() {
    CPU.flags.decimal = false;
}

function CLI() {
    CPU.flags.interrupt = false;
}

function CLV() {
    CPU.flags.overflow = false;
}

function CMP(value) {
    const result = (CPU.A - value) & 0xFF;

    CPU.flags.carry = CPU.A >= value;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function CPX(value) {
    const result = (CPU.X - value) & 0xFF;
    CPU.flags.carry = CPU.X >= value;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function CPY(value) {
    const result = (CPU.Y - value) & 0xFF;
    CPU.flags.carry = CPU.Y >= value;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function DEC(address) {
    const result = (CPU.memory[address] - 1) & 0xFF;
    CPU.memory[address] = result;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function DEX() {
    CPU.X = (CPU.X - 1) & 0xFF;
    CPU.flags.zero = (CPU.X === 0);
    CPU.flags.negative = (CPU.X & 0x80) !== 0;
}

function DEY() {
    CPU.Y = (CPU.Y - 1) & 0xFF;
    CPU.flags.zero = (CPU.Y === 0);
    CPU.flags.negative = (CPU.Y & 0x80) !== 0;
}

function EOR(value) {
    CPU.A = CPU.A ^ value;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function INC(address) {
    const result = (CPU.memory[address] + 1) & 0xFF;
    CPU.memory[address] = result;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function INX() {
    CPU.X = (CPU.X + 1) & 0xFF;
    CPU.flags.zero = (CPU.X === 0);
    CPU.flags.negative = (CPU.X & 0x80) !== 0;
}

function INY() {
    CPU.Y = (CPU.Y + 1) & 0xFF;
    CPU.flags.zero = (CPU.Y === 0);
    CPU.flags.negative = (CPU.Y & 0x80) !== 0;
}

function JMP(address) {
    CPU.PC = address & 0xFFFF;
}

function JSR(address) {
    const returnAddress = (CPU.PC - 1) & 0xFFFF;
    CPU.memory[0x0100 + CPU.SP] = (returnAddress >> 8) & 0xFF;
    CPU.SP = (CPU.SP - 1) & 0xFF;
    CPU.memory[0x0100 + CPU.SP] = returnAddress & 0xFF;
    CPU.SP = (CPU.SP - 1) & 0xFF;
    CPU.PC = address & 0xFFFF;
}

function LDA(value) {
    CPU.A = value & 0xFF;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = ((CPU.A & 0x80) !== 0);
}

function LDX(value) {
    CPU.X = value & 0xFF;
    CPU.flags.zero = (CPU.X === 0);
    CPU.flags.negative = ((CPU.X & 0x80) !== 0);
}

function LDY(value) {
    CPU.Y = value & 0xFF;
    CPU.flags.zero = (CPU.Y === 0);
    CPU.flags.negative = ((CPU.Y & 0x80) !== 0);
}

function LSR(value) {
    const result = (value >> 1) & 0xFF;
    CPU.flags.carry = (value & 0x01) !== 0;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = false;
    return result;
}

function NOP() {
    // do nothing
}

function ORA(value) {
    CPU.A = CPU.A | value;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function PHA() {
    CPU.memory[0x0100 + CPU.SP] = CPU.A;
    CPU.SP = (CPU.SP - 1) & 0xFF;
}

function PHP() {
    const status = getStatusByte() | 0x30;
    CPU.memory[0x0100 + CPU.SP] = status;
    CPU.SP = (CPU.SP - 1) & 0xFF;
}

function PLA() {
    CPU.SP = (CPU.SP + 1) & 0xFF;
    CPU.A = CPU.memory[0x0100 + CPU.SP];
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function PLP() {
    CPU.SP = (CPU.SP + 1) & 0xFF;
    const status = CPU.memory[0x0100 + CPU.SP];

    CPU.flags.carry = (status & 0x01) !== 0;
    CPU.flags.zero = (status & 0x02) !== 0;
    CPU.flags.interrupt = (status & 0x04) !== 0;
    CPU.flags.decimal = (status & 0x08) !== 0;
    CPU.flags.break = (status & 0x10) !== 0;
    CPU.flags.overflow = (status & 0x40) !== 0;
    CPU.flags.negative = (status & 0x80) !== 0;
}

function ROL(value) {
    const carryIn = CPU.flags.carry ? 1 : 0;
    const result = ((value << 1) | carryIn) & 0xFF;
    CPU.flags.carry = (value & 0x80) !== 0;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
    return result;
}

function ROR(value) {
    const carryIn = CPU.flags.carry ? 0x80 : 0;
    const result = ((value >> 1) | carryIn) & 0xFF;
    CPU.flags.carry = (value & 0x01) !== 0;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
    return result;
}

function RTI() {
    CPU.SP = (CPU.SP + 1) & 0xFF;
    const status = CPU.memory[0x0100 + CPU.SP];

    CPU.flags.carry = (status & 0x01) !== 0;
    CPU.flags.zero = (status & 0x02) !== 0;
    CPU.flags.interrupt = (status & 0x04) !== 0;
    CPU.flags.decimal = (status & 0x08) !== 0;
    CPU.flags.break = (status & 0x10) !== 0;
    CPU.flags.overflow = (status & 0x40) !== 0;
    CPU.flags.negative = (status & 0x80) !== 0;

    CPU.SP = (CPU.SP + 1) & 0xFF;
    const lo = CPU.memory[0x0100 + CPU.SP];
    CPU.SP = (CPU.SP + 1) & 0xFF;
    const hi = CPU.memory[0x0100 + CPU.SP];
    CPU.PC = (hi << 8) | lo;
}

function RTS() {
    CPU.SP = (CPU.SP + 1) & 0xFF;
    const lo = CPU.memory[0x0100 + CPU.SP];
    CPU.SP = (CPU.SP + 1) & 0xFF;
    const hi = CPU.memory[0x0100 + CPU.SP];
    CPU.PC = ((hi << 8) | lo) + 1;
}

function SBC(value) {
    const carryIn = CPU.flags.carry ? 0 : 1;
    const result = CPU.A - value - carryIn;

    CPU.flags.carry = CPU.A >= (value + carryIn);
    CPU.flags.zero = (result & 0xFF) === 0;
    CPU.flags.negative = (result & 0x80) !== 0;
    CPU.flags.overflow = ((CPU.A ^ result) & (CPU.A ^ value) & 0x80) !== 0;

    CPU.A = result & 0xFF;
}

function SEC() {
    CPU.flags.carry = true;
}

function SED() {
    CPU.flags.decimal = true;
}

function SEI() {
    CPU.flags.interrupt = true;
}

function STA(address) {
    CPU.memory[address] = CPU.A & 0xFF;
}

function STX(address) {
    CPU.memory[address] = CPU.X & 0xFF;
}

function STY(address) {
    CPU.memory[address] = CPU.Y & 0xFF;
}

function TAX() {
    CPU.X = CPU.A & 0xFF;
    CPU.flags.zero = (CPU.X === 0);
    CPU.flags.negative = (CPU.X & 0x80) !== 0;
}

function TAY() {
    CPU.Y = CPU.A & 0xFF;
    CPU.flags.zero = (CPU.Y === 0);
    CPU.flags.negative = (CPU.Y & 0x80) !== 0;
}

function TSX() {
    CPU.X = CPU.SP & 0xFF;
    CPU.flags.zero = (CPU.X === 0);
    CPU.flags.negative = (CPU.X & 0x80) !== 0;
}

function TXA() {
    CPU.A = CPU.X & 0xFF;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function TXS() {
    CPU.SP = CPU.X & 0xFF;
}

function TYA() {
    CPU.A = CPU.Y & 0xFF;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

// illegal opcodes
function ALR(value) {
    const anded = CPU.A & value;
    const shifted = LSR(anded);
    CPU.A = shifted;
}

function ANC(value) {
    CPU.A = CPU.A & value;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
    CPU.flags.carry = (CPU.A & 0x80) !== 0;
}

function ANE(value) {
    CPU.A = CPU.X & value;
    CPU.flags.zero = (CPU.A === 0);
    CPU.flags.negative = (CPU.A & 0x80) !== 0;
}

function ARR(value) {
    const anded = CPU.A & value;
    const carryIn = CPU.flags.carry ? 0x80 : 0;
    const result = ((anded >> 1) | carryIn) & 0xFF;

    CPU.A = result;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
    CPU.flags.carry = (result & 0x40) !== 0;
    CPU.flags.overflow = ((result >> 6) ^ ((result >> 5) & 1)) !== 0;
}

function DCP(address) {
    const result = (CPU.memory[address] - 1) & 0xFF;
    CPU.memory[address] = result;
    CMP(result);
}

function ISC(address) {
    CPU.memory[address] = (CPU.memory[address] + 1) & 0xFF;

    SBC(CPU.memory[address]);
}

function JAM() {
    CPU.halted = true;
    console.log('Halted.');
}

function LAX(value) {
    CPU.A = value & 0xFF;
    CPU.X = value & 0xFF;
    CPU.flags.zero = (value === 0);
    CPU.flags.negative = (value & 0x80) !== 0;
}

function LAS(address) {
    const value = CPU.memory[address] & CPU.SP;
    CPU.A = value;
    CPU.X = value;
    CPU.SP = value;
    CPU.flags.zero = (value === 0);
    CPU.flags.negative = (value & 0x80) !== 0;
}

function LXA(value) {
    const result = CPU.A & value;
    CPU.A = result;
    CPU.X = result;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function RLA(address) {
    const value = CPU.memory[address];
    const rotated = ROL(value);
    CPU.memory[address] = rotated;
    AND(rotated);
}

function RRA(address) {
    const value = CPU.memory[address];
    const rotated = ROR(value);
    CPU.memory[address] = rotated;
    ADC(rotated);
}

function SAX(address) {
    CPU.memory[address] = CPU.A & CPU.X;
}

function SBX(value) {
    const temp = (CPU.A & CPU.X) & 0xFF;
    const result = (temp - value) & 0xFF;

    CPU.X = result;
    CPU.flags.carry = temp >= value;
    CPU.flags.zero = (result === 0);
    CPU.flags.negative = (result & 0x80) !== 0;
}

function SHA(address, highByte) {
    const value = CPU.A & CPU.X & (highByte + 1);
    CPU.memory[address] = value;
}

function SHX(address, highByte) {
    const value = CPU.X & (highByte + 1);
    CPU.memory[address] = value;
}

function SHY(address, highByte) {
    const value = CPU.Y & (highByte + 1);
    CPU.memory[address] = value;
}

function SLO(address) {
    const value = CPU.memory[address];
    const shifted = ASL(value);
    CPU.memory[address] = shifted;
    ORA(shifted);
}

function SRE(address) {
    const value = CPU.memory[address];
    const shifted = LSR(value);
    CPU.memory[address] = shifted;
    EOR(shifted);
}

function TAS(address, highByte) {
    CPU.SP = CPU.A & CPU.X;
    const value = CPU.SP & (highByte + 1);
    CPU.memory[address] = value;
}

// execute opcodes
function handler(fn) {
    return () => fn();
}

function executeNextInstruction() {
    if (CPU.halted) return;

    const opcode = CPU.memory[CPU.PC++];
    if (JAM_OPCODES.includes(opcode)) {
        JAM();
        return;
    }

    const handler = opcodeMap[opcode];
    if (handler) {
        handler();
    } else {
        console.warn(`Unknown opcode encountered ($${opcode.toString(16).padStart(2, '0')} at $${(CPU.PC - 1).toString(16).padStart(4, '0')})`);
    }
}