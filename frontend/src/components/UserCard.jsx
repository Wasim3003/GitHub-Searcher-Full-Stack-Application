const UserCard = ({ user }) => {
  return (
    <a
      href={user.html_url}
      target="_blank"
      className="card"
      rel="noreferrer"
    >
      <img src={user.avatar_url} alt={user.login} />
      <h3>{user.login}</h3>
      <p>ID: {user.id}</p>
    </a>
  );
};

export default UserCard;
