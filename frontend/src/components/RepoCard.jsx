const RepoCard = ({ repo }) => {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      className="card"
      rel="noreferrer"
    >
      <h3>{repo.name}</h3>
      <p>Owner: {repo.owner.login}</p>
      <p>⭐ Stars: {repo.stargazers_count}</p>
      <p>🍴 Forks: {repo.forks_count}</p>
    </a>
  );
};

export default RepoCard;
