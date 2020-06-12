const URL = 'https://api.github.com/';
const REP_PER_PAGE = 10;

export class ApiComponent {
	constructor() {
	}

	// Загрузка репозиториев
	async loadRepositories(value='stars%3A>100&s=stars', page='1') {
		return await fetch(
			`${URL}search/repositories?q=${value}&per_page=${REP_PER_PAGE}&page=${page}`
		)
	}

	//Получаем данные выбранного пользователя
	loadUserData(name, login) {
		const urls = [
			`${URL}repos/${login}/${name}/contributors`,
			`${URL}repos/${login}/${name}/languages`
		];
		const requests = urls.map(url => fetch(url));
		return Promise.all(requests)
			.then(responses => Promise.all((responses.map(r => r.json()))));
	}

}