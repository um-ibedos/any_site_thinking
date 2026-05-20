(async _ => {
    const matches = (await chrome.storage.local.get('matches')).matches;
    if (!matches) return;
    if (matches.some(e => new URLPattern(e).test(location.href))) return;
    const F = _ => {
        const nodesSnapshot = document.evaluate(
            '//*[not(self::style or self::script)]/text()',
            document,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
        );
        const arr = [];
        for (let e; e = nodesSnapshot.iterateNext(); arr.push(e));
        arr.forEach(e => /(?<=[^\s]+.*)(?<!🤔)$/img.test(e.textContent) && (e.textContent = e.textContent.replace(/(?<=[^\s]+.*)(?<!🤔)$/img, '🤔')));
    };
    new MutationObserver(F).observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true
    });
    F();
})();