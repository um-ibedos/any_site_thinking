let matches = (await chrome.storage.local.get('matches')).matches || [];
const F = content => {
    const {
        tr,
        td,
        input,
        button
    } = {
        tr: document.createElement('tr'),
        td: [document.createElement('td'), document.createElement('td'), document.createElement('td')],
        input: document.createElement('input'),
        button: [document.createElement('button'), document.createElement('button')]
    };
    tr.append(...td);
    td[1].append(button[0]);
    td[2].append(button[1]);
    td[0].append(input);
    input.value = content;
    input.disabled = true;
    button[0].textContent = '🤔';
    button[1].textContent = '×';
    button[0].addEventListener('click', _ => {
        if (input.disabled) {
            input.disabled = false;
            input.focus();
            button[0].textContent = '👍';
        } else {
            try {
                new URLPattern(input.value);
            } catch {
                return input.focus();
            }
            input.disabled = true;
            button[0].textContent = '🤔';
            matches[matches.indexOf(content)] = input.value;
            chrome.storage.local.set({ matches });
        }
    });
    input.addEventListener('input', _ => {
        try {
            new URLPattern(input.value);
        } catch {
            return input.className = 'invalid';
        }
        input.className = '';
    });
    button[1].addEventListener('click', _ => {
        matches = matches.filter(e => e != content);
        chrome.storage.local.set({ matches });
        tr.remove();
    });
    document.querySelector('tbody').prepend(tr);
};
matches.toReversed().forEach(F);
document.querySelector('thead button').addEventListener('click', async _ => {
    const url = new URL((await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url).origin;
    if (!new URLPattern('http*://*').test(url) && !new URLPattern('file:///*').test(url) || matches.includes(url)) return;
    matches.unshift(url);
    chrome.storage.local.set({ matches });
    F(url);
});