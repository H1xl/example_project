import React, { useState } from 'react';
import './RepoSearch.css';

const RepoSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currPage, setCurrPage] = useState(1);

    const handleSearch = (amount = 0, newResponse = false) => {
        if (!searchTerm) return;
        
        setCurrPage(!newResponse ? currPage + amount : 1);

        isSearching !== true && 
        setTimeout(() => {
            setIsSearching(true);
        }, 500);

        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}&page=${currPage + amount}&per_page=8`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка подключения к API GitHub');
                return response.json();
            })
            .then(data => {
                setRepos(data.items);
                setTotalPages(Math.ceil(data.total_count / 8));
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                setRepos([]);
            });
    };

    return (
        <>
            <div className={`input-container ${isSearching ? 'transform-up' : 'transform-center'}`}>
            <h1>Найти репозитории GitHub <i class="bi bi-github"></i></h1>
                <div class="input-group w-size-400 mx-auto p-2">
                    <input type="text" 
                        class="form-control" 
                        placeholder="Введите имя искомого репозитория" 
                        aria-describedby="basic-addon1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                        
                    <div class="input-group-append">
                        <button type="button" 
                            class="btn btn-outline-primary"
                            onClick={() => {handleSearch(0, true)}}>
                                Искать
                        </button>
                    </div>
                </div>
            </div>            

            {error && (
                <div class="row justify-content-center">
                    <div class="err card col-1 align-self-center m-3 w-size-400 text-danger-emphasis bg-danger-subtle border-danger-subtle">
                        <div class="card-body">
                            {error}
                        </div>
                    </div>
                </div>         
            )}
            
            {repos.length > 0 && (
                <div class="d-flex flex-wrap justify-content-center">                    
                    {repos.map(repo => (
                        <a href={repo.html_url}>
                            <div class="card m-2 w-size-400 bg-dark text-light border border-secondary">
                                <img src={repo.owner.avatar_url} class="card-img-top object-fit-cover card-img-size-200" alt="..." />
                                <div class="card-body">
                                    <h4 class="card-title"><strong class="text-light">{repo.name}</strong></h4>
                                    <h6 class="text-secondary">от {repo.owner.login}</h6>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item bg-dark text-light border border-secondary"><i class="bi bi-star-fill"></i> {repo.stargazers_count} / <i class="bi bi-eye-fill"></i> {repo.watchers_count}</li>
                                </ul>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center m-3">
                        <li class="page-item">
                            <button class="page-link bg-dark text-light border-secondary" 
                            aria-label="Previous" 
                            onClick={() => {handleSearch(currPage * -1 + 1)}}>
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        
                        {currPage > 2 && ( 
                            <li class="page-item">
                                <button 
                                    class="page-link bg-dark text-light border-secondary" 
                                    onClick={() => {handleSearch(-2)}}>
                                        {currPage - 2}
                                </button>
                            </li>
                        )}
                        {currPage > 1 && ( 
                            <li class="page-item">
                                <button 
                                    class="page-link bg-dark text-light border-secondary" 
                                    onClick={() => {handleSearch(-1)}}>
                                        {currPage - 1}
                                </button>
                            </li> 
                        )}
                        <li class="page-item">
                            <button 
                                class="page-link bg-primary text-light border-secondary">
                                    {currPage}
                            </button>
                        </li>
                        {currPage < totalPages - 1 && ( 
                            <li class="page-item">
                                <button 
                                    class="page-link bg-dark text-light border-secondary" 
                                    onClick={() => {handleSearch(1)}}>
                                        {currPage + 1}
                                </button>
                            </li> 
                        )}
                        {currPage < totalPages - 2 && ( 
                            <li class="page-item">
                                <button 
                                    class="page-link bg-dark text-light border-secondary" 
                                    onClick={() => {handleSearch(2)}}>
                                        {currPage + 2}
                                </button>
                            </li> 
                        )}

                        <li class="page-item">
                            <button 
                                class="page-link bg-dark text-light border-secondary" 
                                aria-label="Next"                                                                 
                                // По какой-то причине API отказывается выдавать ответы дальше ~100 страницы
                                onClick={() => {handleSearch((currPage * -1) + totalPages)}}>                                     
                                    <span aria-hidden="true">&raquo;</span>
                            </button>                            
                        </li>
                    </ul>
                </nav>                
            )}
        </>
    );
};

export default RepoSearch;
