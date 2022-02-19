/* export const checkPassword = password => {
	if (password.length < 8 || password.length > 16) {
		return {
			status: 400,
			msg: 'La contraseña debe de tener de 8 a 16 caracteres',
		};
	} else if (
		password === '12345678' ||
		password === 'contraseña'
	) {
		return {
			status: 400,
			msg: 'Contraseña muy insegura',
		};
	}
}; */

module.exports.generateCode = () => {
	let result = '';
	let characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz_';
	//let charactersLength = characters.length;
	for (let i = 0; i < 6; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return result;
};
