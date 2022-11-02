const Write = () => {
    const [review, setReview] = useState("");
    const onSubmit = (event) => {
        event.preventDefault();
    };
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setReview(value);
    }
    return (
        <form onSubmit={onSubmit}>
            <input type="text" value={review} onChange={onChange} placeholder="1" maxLenght={1000} />
            <input type="submit" value="review" />
        </form>
    );
}

export default Write;