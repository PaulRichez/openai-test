const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const form = document.querySelector<HTMLFormElement>('form');
const ageInput = document.querySelector<HTMLInputElement>('age');
const OPENAI_API_KEYInput = document.querySelector<HTMLInputElement>('OPENAI_API_KEY');
const themeInput = document.querySelector<HTMLInputElement>('theme');
const submitButton = document.querySelector<HTMLButtonElement>('button');
const footer = document.querySelector<HTMLElement>('footer');

const generatePromptByAgeandTheme = (age: number, theme = "") => {
    let prompt = `Propose moi, avec un ton joyeux et amical, 5 idéés cadeau pour une personne agée de ${age} ans`;

    if (theme.trim()) {
        prompt += ` et qui aime ${theme}`;
    }

    return prompt += ` !`;
};

const setLoadingItems = () => {
    (footer as HTMLElement).textContent = 'Chargement des idées en cours !';
    footer?.setAttribute('aria-busy', 'true');
    submitButton?.setAttribute('aria-busy', 'true');
    (submitButton as HTMLButtonElement).disabled = true;
}

const removeLoadingItems = () => {
    footer?.setAttribute('aria-busy', 'false');
    submitButton?.setAttribute('aria-busy', 'false');
    (submitButton as HTMLButtonElement).disabled = false;
};

form?.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    setLoadingItems();

    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY || (OPENAI_API_KEYInput as HTMLInputElement).value}`
        },
        body: JSON.stringify({
            prompt: generatePromptByAgeandTheme((ageInput?.valueAsNumber as number), themeInput?.value),
            max_tokens: 2000,
            model: 'text-davinci-003'
        })
    }).then((response: Response) => {
        response.json().then(data => {
            (footer as HTMLElement).innerHTML = translateTextToHtml(data.choices[0].text);
        }).finally(() => {
            removeLoadingItems();
        })
    })
})

const translateTextToHtml = (text: string) => text.split('\n').map((str) => `<p>${str}</p>`).join('');


export { }

