export function makeid(length:number=32) {
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    let array:string[] = new Array(length)
    for ( var i = 0; i < length; i++ ) {
       array[i] = characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return array.join("")+"-"+Date.now();
 }