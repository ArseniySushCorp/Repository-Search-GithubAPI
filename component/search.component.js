
export class SearchComponent{

	// Устанавливаем текущую страницу поиска
	setCurrentPage(pageNumber) {
		this.currentPage = pageNumber;
	}

	// Получаем текущую страницу поиска
	setRepCount(count) {
		this.repCount = count;
	}

	constructor(view,api,log) {
		this.view = view;
		this.api = api;
		this.log = log;

		this.view.searchInput.addEventListener('keyup',this.debounce(this.loadRepositories.bind(this), 500))
		this.view.loadMoreBtn.addEventListener('click',this.loadMoreRepos.bind(this))
		this.currentPage = 1;
		this.repCount = 0;
		this.ifReload();
	}
	//первый поиск
	loadRepositories() {
		localStorage.setItem('input', this.view.searchInput.value);

		this.setCurrentPage(1);
		this.view.setCounterMessage('');
		if (this.view.searchInput.value) {
			this.clearAll()
			this.reposRequest(this.view.searchInput.value);
		} else {
			this.clearAll();
			this.view.toggleLoadMoreBtn(false);
		}

	}
	// Поведение при обновлении страницы
	ifReload() {
		if (localStorage.getItem('input') === '') {
			localStorage.removeItem('input');
		}

		if (this.view.searchInput.value === '' && localStorage.getItem('input')) {
			this.view.searchInput.value = localStorage.getItem('input');
			this.reposRequest(localStorage.getItem('input'));
		} else if (this.view.searchInput.value === '' && localStorage.getItem('input') === null ) {
			this.reposRequest();
		}
	}
	// Подгружаем репозитории при нажатии на кнопку "Load more"
	loadMoreRepos() {
		this.setCurrentPage(this.currentPage + 1);
		this.reposRequest(this.view.searchInput.value);
	}

	// Запрос на обновление списка репозиториев
	async reposRequest(searchValue) {
		let totalCount, users,message;
		try	{
			await this.api.loadRepositories(searchValue,this.currentPage).then((res) => {
				res.json().then(res => {
					users = res.items;
					totalCount = res.total_count;
					message = this.log.counterMessage(totalCount)
					this.view.setCounterMessage(message);
					this.setRepCount(this.repCount + res.items.length);
					this.view.toggleLoadMoreBtn(totalCount > 10 && this.repCount !== totalCount);
					users.forEach(repository => this.view.createRepository(repository))
				})
			})
		} catch (e) {
			console.log('Error ' + e);
		}

	}

	// Очищаем список репозиториев и карточку пользователя
	clearAll() {
		this.view.repList.innerHTML = '';
		this.view.userWrapper.innerHTML = '';
	}

	// Задержка ввода данных для отправки запроса
	debounce(func, wait, immediate) {
		let timeout;
		return function() {
			const context = this, args = arguments;
			const later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
}