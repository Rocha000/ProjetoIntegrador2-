function gerarCodigo(){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    str = '';
    for (i = 0; i < 8; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}