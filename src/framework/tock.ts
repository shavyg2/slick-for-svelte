

let tock = Promise.resolve();
export function setTock(promise:Promise<any>){
    tock = Promise.resolve(promise);
}


export async function Tock(){
    await tock;
}