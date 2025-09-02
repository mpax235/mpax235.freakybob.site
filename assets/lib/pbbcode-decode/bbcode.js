/*
 *                    kinda usefull for stuff ig
 */
(function (global) {
    class BBCodeThing {
        constructor() {
            this.allowedProtocols = ['http:', 'https:', 'mailto:'];
            this.allowedTags = ['b', 'i', 'u', 's', 'small', 'br', 'img', 'a', 'marquee', 'audio'];
            this.proxyPrefix = 'https://proxy.pikidiary.lol/?url=';

            this.bbcodeTags = {
                'b': { open: '<b>', close: '</b>' },
                'i': { open: '<i>', close: '</i>' },
                'u': { open: '<u>', close: '</u>' },
                's': { open: '<s>', close: '</s>' },
                'small': { open: '<small>', close: '</small>' },
                'br': { open: '<div class="br"></div>', close: '', selfClosing: true },
                'url': { handler: this.handleUrl.bind(this), hasContent: true },
                'img': { handler: this.handleImg.bind(this), hasContent: true },
                'marquee': { open: '<marquee scrollamount="3">', close: '</marquee>' },
                'style': { handler: this.handleStyle.bind(this), hasContent: true },
                'music': { handler: this.handleMusic.bind(this), hasContent: true }
            };
        }
        escapeHtml(text) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '&') {
                    const entityMatch = text.substring(i).match(/^&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/);
                    if (entityMatch) {
                        result += entityMatch[0];
                        i += entityMatch[0].length - 1;
                    } else {
                        result += '&amp;';
                    }
                } else if (char === '<') result += '&lt;';
                else if (char === '>') result += '&gt;';
                else if (char === '"') result += '&quot;';
                else if (char === "'") result += '&apos;';
                else if (char === '\n' || char === '\r') result += ' ';
                else result += char;
            }
            return result;
        }
        sanitizeUrl(url) {
            if (!url) return '';
            try {
                const decoded = decodeURIComponent(url);
                url = decoded.trim();
            } catch (e) {
                url = url.trim();
            }
            try {
                const urlObj = new URL(url);
                if (this.allowedProtocols.includes(urlObj.protocol)) return url;
            } catch (e) {
                if (!/^(javascript|data|vbscript):/i.test(url)) return url;
            }
            return '';
        }
        proxyUrl(url) {
            return decodeURIComponent(url); // patched
        }
        handleUrl(content, attribute) {
            const href = this.sanitizeUrl(attribute || content);
            if (!href) return content ? this.escapeHtml(content) : '';

            let displayContent = content;

            if (href.startsWith('@')) {
                const username = href.substring(1);
                const escapedUsername = this.escapeHtml(username);
                displayContent = (content && content.trim() !== '' && content !== href) ? content : escapedUsername;
                return `<a href="@${escapedUsername}" style="cursor: pointer;" target="_blank" rel="noopener noreferrer">${displayContent}</a>`;
            }

            const escapedHref = this.escapeHtml(href);
            if (!displayContent || displayContent.trim() === '' || displayContent === attribute) {
                displayContent = escapedHref;
            }

            return `<a href="${escapedHref}" style="cursor: pointer;" target="_blank" rel="noopener noreferrer">${displayContent}</a>`;
        }
        handleImg(content) {
            const src = this.sanitizeUrl(content);
            if (!src) return '';
            const proxiedSrc = this.proxyUrl(src);
            const fallback = 'https://raw.githubusercontent.com/5quirre1/5quirre1/refs/heads/main/goodies/CDN/pikiimgerror.gif';
            return `<img src="${proxiedSrc}" alt="image" onerror="this.onerror=null;this.src='${fallback}';">`;
        }
        handleStyle(content, attribute) {
            if (attribute === 'bg') {
                const colorRegex = /^(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)$/;
                const urlRegex = /^https?:\/\/.+/;

                if (colorRegex.test(content)) {
                    const escapedColor = this.escapeHtml(content);
                    return `<style>body { background-color: ${escapedColor} !important; }</style>`;
                } else if (urlRegex.test(content)) {
                    const proxiedUrl = this.proxyUrl(content);
                    return `<style>body { background-image: url('${proxiedUrl}') !important; background-repeat: repeat !important; }</style>`;
                }
            } else if (attribute === 'cursor') {
                const urlRegex = /^https?:\/\/.+/;
                if (urlRegex.test(content)) {
                    const proxiedUrl = this.proxyUrl(content);
                    return `<style>body, * { cursor: url('${proxiedUrl}'), auto !important; } a, a img { cursor: pointer !important; }</style>`;
                }
            }
            return '';
        }
        handleMusic(content, attribute) {
            const src = this.sanitizeUrl(content);
            if (!src) return '';
            const proxiedSrc = this.proxyUrl(src);
            let audioAttributes = 'controls';

            if (attribute) {
                const params = attribute.split(',').map(p => p.trim().toLowerCase());
                if (params.includes('autoplay')) audioAttributes += ' autoplay';
                if (params.includes('loop')) audioAttributes += ' loop';
            }

            return `<audio ${audioAttributes} style="width: 100%; margin: 5px 0;"><source src="${proxiedSrc}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
        }
        parseAttributes(tagContent) {
            const equalIndex = tagContent.indexOf('=');
            if (equalIndex === -1) return { tag: tagContent.toLowerCase(), attribute: null };

            const tag = tagContent.substring(0, equalIndex).toLowerCase();
            const attribute = tagContent.substring(equalIndex + 1);
            return { tag, attribute };
        }
        replaceComments(text) {
            return text.replace(/\/\*([\s\S]*?)\*\//g, function (match, commentContent) {
                const escapedComment = this.escapeHtml(commentContent);
                return `<!--${escapedComment}-->`;
            }.bind(this));
        }
        parse(text) {
            if (!text) return '';

            const tokens = this.tokenize(text);
            const processedText = this.processTokens(tokens);
            return this.replaceComments(processedText);
        }
        tokenize(text) {
            const tokens = [];
            let i = 0;

            while (i < text.length) {
                if (text[i] === '[') {
                    let tagEnd = text.indexOf(']', i);
                    if (tagEnd === -1) {
                        tokens.push({ type: 'text', content: text[i] });
                        i++;
                        continue;
                    }

                    const tagContent = text.substring(i + 1, tagEnd);
                    const isClosingTag = tagContent.startsWith('/');

                    if (isClosingTag) {
                        const tagName = tagContent.substring(1).toLowerCase();
                        tokens.push({ type: 'close', tag: tagName });
                    } else {
                        const parsed = this.parseAttributes(tagContent);
                        tokens.push({ type: 'open', tag: parsed.tag, attribute: parsed.attribute });
                    }

                    i = tagEnd + 1;
                } else {
                    let textStart = i;
                    while (i < text.length && text[i] !== '[') i++;
                    tokens.push({ type: 'text', content: text.substring(textStart, i) });
                }
            }

            return tokens;
        }
        processTokens(tokens) {
            const stack = [];
            let result = '';

            const getInnermostHandler = () => {
                for (let i = stack.length - 1; i >= 0; i--) {
                    if (stack[i].isHandler) return stack[i];
                }
                return null;
            };

            for (const token of tokens) {
                if (token.type === 'text') {
                    const innermostHandler = getInnermostHandler();
                    if (innermostHandler) innermostHandler.content += token.content;
                    else result += this.escapeHtml(token.content);
                } else if (token.type === 'open') {
                    const tagDef = this.bbcodeTags[token.tag];
                    const innermostHandler = getInnermostHandler();

                    if (!tagDef) {
                        const tagText = `[${token.tag}${token.attribute ? '=' + token.attribute : ''}]`;
                        if (innermostHandler) innermostHandler.content += this.escapeHtml(tagText);
                        else result += this.escapeHtml(tagText);
                        continue;
                    }

                    if (tagDef.selfClosing) {
                        if (innermostHandler) innermostHandler.content += tagDef.open;
                        else result += tagDef.open;
                    } else if (tagDef.handler) {
                        stack.push({
                            tag: token.tag,
                            attribute: token.attribute,
                            isHandler: true,
                            content: ''
                        });
                    } else {
                        if (innermostHandler) innermostHandler.content += tagDef.open;
                        else result += tagDef.open;
                        stack.push({
                            tag: token.tag,
                            attribute: token.attribute,
                            isHandler: false
                        });
                    }
                } else if (token.type === 'close') {
                    let stackIndex = -1;
                    for (let i = stack.length - 1; i >= 0; i--) {
                        if (stack[i].tag === token.tag) {
                            stackIndex = i;
                            break;
                        }
                    }

                    if (stackIndex !== -1) {
                        const processedParts = [];
                        for (let i = stack.length - 1; i >= stackIndex; i--) {
                            const stackItem = stack[i];
                            const tagDef = this.bbcodeTags[stackItem.tag];
                            let processedHtml = '';

                            if (stackItem.isHandler) {
                                processedHtml = tagDef.handler(stackItem.content, stackItem.attribute);
                            } else {
                                processedHtml = tagDef.close;
                            }
                            processedParts.unshift(processedHtml);
                            stack.pop();
                        }
                        const innermostActiveHandler = getInnermostHandler();
                        if (innermostActiveHandler) innermostActiveHandler.content += processedParts.join('');
                        else result += processedParts.join('');
                    } else {
                        const closeTagText = `[/${token.tag}]`;
                        const innermostHandler = getInnermostHandler();
                        if (innermostHandler) innermostHandler.content += this.escapeHtml(closeTagText);
                        else result += this.escapeHtml(closeTagText);
                    }
                }
            }

            while (stack.length > 0) {
                const stackItem = stack.pop();
                const tagDef = this.bbcodeTags[stackItem.tag];

                if (tagDef && tagDef.handler) {
                    result += tagDef.handler(stackItem.content, stackItem.attribute);
                } else if (tagDef && tagDef.open) {
                    result += tagDef.open;
                    if (stackItem.content !== undefined) {
                        result += this.escapeHtml(stackItem.content);
                    }
                } else {
                    const originalTagText = `[${stackItem.tag}${stackItem.attribute ? '=' + stackItem.attribute : ''}]`;
                    result += this.escapeHtml(originalTagText);
                }
            }

            return result;
        }
    }

    const bbcodeParser = new BBCodeThing();

    global.formatContentWithBBCode = function (text) {
        if (!text) return '';
        return bbcodeParser.parse(text);
    };
})(window);