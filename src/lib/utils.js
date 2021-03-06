module.exports = {
    date(timestamp) {
        const date = new Date(timestamp);

        // Ano
        const year = date.getUTCFullYear();

        // .slice(-2) pega os dois últimos dígitos de traz para frente
        // Quando for mês 02 pega o 02
        // Quando for mês 010 pega o 10

        // Mês - Mês começa em 0 e vai até 11, por isso o "+ 1"
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        // Dia
        const day = `0${date.getUTCDate()}`.slice(-2);

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    randomPassword(length) {
        let result = '';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
};