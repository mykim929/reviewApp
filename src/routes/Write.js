import { useState, useRef } from "react";
import { dbService } from "fbase";
import { collection, addDoc } from "firebase/firestore";

const Write = () => {
    const [title, setTitle] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        setInputItems(inputItems.filter(item => item.review || item.translate !== ''))
        await addDoc(collection(dbService, "reviewapp"), {
            createdAt: Date.now(),
            title: title,
            list: inputItems
        });
        setTitle("");
        setInputItems([{id:0, review:"", translate:""}]);
    };
    const onChange = (event) => {
        const {
            target: {name, value}
        } = event;
        if (name === "title") {
            setTitle(value);
        }
    }
    const nextID = useRef(1);
    const [inputItems, setInputItems] = useState([{id:0, review:"", translate:""}]);
    const addInput = (event) => {
        event.preventDefault();
        const input = {
            id: nextID.current,
            review: '',
            translate: ''
        }
        setInputItems([...inputItems, input]);
        nextID.current += 1;
    }
    const handleChange = (e, index) => {
        const {
            target: {value, name} 
        } = e;
        const inputItemsCopy = JSON.parse(JSON.stringify(inputItems));
        if(name === "review") {
            inputItemsCopy[index].review = value;
            setInputItems(inputItemsCopy);
        } else if(name === "translate"){
            inputItemsCopy[index].translate = value;
            setInputItems(inputItemsCopy);
        }
    }
    return (
        <form onSubmit={addInput}>
            <input type="text" value={title} name="title" onChange={onChange} placeholder="제목" maxLength={1000} />
            {inputItems.map((item, index) => (
                <div key={index}>
                    <input type="text" name="review" className={`list_${index}`} onChange={e => handleChange(e, index)} value={item.review} />
                    <input type="text" name="translate" className={`list_${index}`} onChange={e => handleChange(e, index)} value={item.translate} />
                    <button type="submit"> + </button>
                </div>
            ))}
            <input type="button" value="save" onClick={onSubmit} />
        </form>
    );
}

export default Write;