export class ViewComponent{
	constructor(api) {
		this.api = api;

		this.app = document.getElementById('app');

		// Заголовок
		this.title = this.createElement('h1','title');
		this.title.textContent = 'Github Search Repositories';

		// Поле поиска
		this.searchLine = this.createElement('div', 'search-line');
		this.searchInput = this.createElement('input', 'search-input');
		this.searchCounter = this.createElement('span','counter');
		this.searchLine.append(this.searchInput);
		this.searchLine.append(this.searchCounter);

		// Список репозиториев
		this.RepositoryWrapper = this.createElement('div','repositories-wrapper')
		this.repList = this.createElement('table', 'repositories')
		this.RepositoryWrapper.append(this.repList);

		// Карточка пользователя
		this.userWrapper = this.createElement('div','user-info')

		// Основной блок
		this.main = this.createElement('div','main');
		this.main.append(this.RepositoryWrapper)
		this.main.append(this.userWrapper)

		// Кнопка "Load more"
		this.loadMoreBtn = this.createElement('button','btn');
		this.loadMoreBtn.textContent = 'Load more';
		this.loadMoreBtn.style.display = 'none';
		this.RepositoryWrapper.append(this.loadMoreBtn);

		//Добавление всех блоков в приложение
		this.app.append(this.title);
		this.app.append(this.searchLine);
		this.app.append(this.main);
	}

	// Функция для создания элемента
	createElement(elementName, className) {
		const element = document.createElement(elementName);
		if (className) {
			element.classList.add(className);
		}
		return element;
	}

	// Создаем каждый найденный репозиторий
	createRepository(repData) {
		const repElement = this.createElement('tr','repository');
		const lastCommit = new Date((repData.updated_at)).toDateString()
		repElement.addEventListener('click', () => this.showUserData(repData))
		// item.name , item.stargazers_count , item.updated_at , item.html_url
		repElement.innerHTML = `<td>${repData.name}</td>
								 <td>Stars:${repData.stargazers_count}</td>
								 <td>Last commit: ${lastCommit}</td>
								 <td><a href="${repData.html_url}" target="_blank">Repository link</a></td>`;
		this.repList.append(repElement);
	}

	// Показываем данные выбранного пользователя
	//userData.description,  userData.name , userData.stargazers_count , lastCommit, userData.html_url, userData.owner.login
	showUserData(userData) {
		const userEl = this.createElement('div','user');
		this.userWrapper.innerHTML = '';
		this.api.loadUserData(userData.name, userData.owner.login)
			.then(res => {
				const [contributors, languages] = res;
				const contributorsList = this.createDataList(contributors, 'Top-10 Contributors:')
				const languagesList = this.createDataList(languages, 'Languages:')

				userEl.innerHTML = `<img class="user-img" src="${userData.owner.avatar_url}" alt="${userData.owner.login}">
									<a class="user-link" href="${userData.html_url}" target="_blank">${userData.owner.login}</a>
									${languagesList}
									${contributorsList}`
			});
		this.userWrapper.append(userEl);
	}
	// Создание карточки пользователя
	createDataList(list, title) {
		const block = this.createElement('div','user-block');
		const titleTag = this.createElement('h3','user-block-title');
		const listTag = this.createElement('ul','user-list-languages');
		const numListTag = this.createElement('ol','user-list-contributors');
		titleTag.textContent = title;
		block.append(titleTag);
		if (title === 'Top-10 Contributors:') {
				for (let item in list) {
					const el = this.createElement('li','user-list-item')
					el.innerHTML = `${list[item].login}`;
					numListTag.append(el);
					if (item>=9) {
						break;
					}
				}
				block.append(numListTag);
		} else {
			for (let item in list) {
				const el = this.createElement('li','user-list-item')
				el.innerHTML = `${item}`;
				listTag.append(el)
			}
			block.append(listTag);
		}


		return block.innerHTML;
	}

	toggleLoadMoreBtn(show) {
		this.loadMoreBtn.style.display = show ? 'block' : 'none';
	}
	//Показываем или скрываем кнопку "Load more"
	setCounterMessage(message) {
		this.searchCounter.textContent = message;
	}
}
