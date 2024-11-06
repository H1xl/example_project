import React, { useState } from 'react';
import './RepoSearch.css';

const RepoSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = () => {
        if (!searchTerm) return;

        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setRepos(data.items);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                setRepos([]);
            });

        setTimeout(() => {
            setIsSearching(true);
        }, 500);
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
                            onClick={handleSearch}>
                                Искать
                        </button>
                    </div>
                </div>
            </div>
            
            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}

            {repos.length > 0 && (
                <div class="d-flex flex-wrap justify-content-center">
                    {repos.map(repo => (
                        <a href={repo.html_url}>
                            <div class="card m-2 w-size-400 bg-dark text-light border border-secondary">
                                <img src={repo.owner.avatar_url} class="card-img-top object-fit-cover card-img-size-200" alt="..." />
                                <div class="card-body">
                                    <h5 class="card-title text-secondary"><strong class="text-light">{repo.name}</strong> от {repo.owner.login}</h5>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item bg-dark text-light border border-secondary"><i class="bi bi-star-fill"></i> {repo.stargazers_count} / <i class="bi bi-eye-fill"></i> {repo.watchers_count}</li>
                                </ul>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

export default RepoSearch;
