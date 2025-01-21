'use client'
import Authorization from '../../../components/Authorization';

export default  function Page() {
  


  return (

    <Authorization requiredRoles={['admin', 'athelete', 'APP_RUN_ADMIN']}>
      {(user) => (
<>
        <div className="mt-40"></div>
        <h1>Hello {user.given_name},</h1>

</>
      )}
    </Authorization>
  
  
  );
};

