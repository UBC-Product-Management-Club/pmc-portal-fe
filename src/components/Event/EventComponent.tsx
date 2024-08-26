export default function EventComponent(
    {media, name, date, location, price, description}: EventComponentProps) {
    return <div>
        <div>
            {media.map(e =>
                <img src={e}/>)}
        </div>
        <h1>{name}</h1>
        <p>{date.toLocaleString()}</p>
        <p>{location}</p>
        <p>{price}</p>
        <button>Sign up</button>
        <h2>About the event</h2>
        <p>{description}</p>
    </div>;
}

type EventComponentProps = {
    name: string,
    date: Date,
    location: string,
    price: number,
    description: string,
    media: string[],
}