import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '30px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#e74c3c',
          marginBottom: '20px'
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: '36px',
          color: '#2c3e50',
          marginBottom: '15px'
        }}
      >
        Page Non Trouvée
      </h1>

      <p
        style={{
          fontSize: '18px',
          color: '#7f8c8d',
          marginBottom: '40px',
          maxWidth: '500px'
        }}
      >
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <Link
        to="/"
        style={{
          padding: '15px 30px',
          backgroundColor: '#9b59b6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
      >
        Retour à l'accueil
      </Link>

      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          gap: '20px'
        }}
      >
        <Link
          to="/courses"
          style={{
            padding: '12px 24px',
            backgroundColor: '#95a5a6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Voir les cours
        </Link>
        <Link
          to="/profile"
          style={{
            padding: '12px 24px',
            backgroundColor: '#95a5a6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Mon profil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;