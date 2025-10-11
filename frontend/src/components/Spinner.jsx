import { ClipLoader } from 'react-spinners';

const Spinner = () => {

    const override = {
        display: 'block',
        margin: '20% auto',
        color: 'blue',
        text: '50px',
    }

    return (
        <ClipLoader
        cssOverride={override}
        size={150}
        />
    )
}

export default Spinner