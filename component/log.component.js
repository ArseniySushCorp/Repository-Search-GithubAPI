export class LogComponent {
	constructor() {
	}

	// Сообщение с числом пользователей
	counterMessage(counter) {
		return counter? `Find ${counter} repositories`: 'Nothing was found'
	}
}