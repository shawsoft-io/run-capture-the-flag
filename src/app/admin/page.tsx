'use client'
import Authorization from '../../components/Authorization';

const AdminPage = () => {
  return (
    <Authorization requiredRoles={['admin']}>
      {(user) => (
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Your roles: {(user['https://run.shawsoft.io/roles'] || []).join(', ')}</p>
        </div>
      )}
    </Authorization>
  );
};

export default AdminPage;