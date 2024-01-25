export const copyToClipboard = (txt: string) =>{
    window.navigator.clipboard.writeText(txt);
    return true;
}