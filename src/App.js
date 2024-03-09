import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  return (
    <div className="app">
      <Logo />
      <Form setItems={setItems} items={items} />
      <PackingList items={items} setItems={setItems} />
      <Stats items={items} />
    </div>
  );
}
// ========== Logo ==========
function Logo() {
  return <h1>📦 Far Away ⚛️</h1>;
}
// ========== Form ==========
function Form(props) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addItemsHandler = (item) => {
    props.setItems((ele) => ele.concat(item));
  };

  const submitHandler = (event) => {
    try {
      event.preventDefault();
      const newItem = {
        id: props.items.length + 1,
        description,
        quantity,
        packed: false,
      };
      if (!description) throw new Error("Invalid description (empty item)");
      addItemsHandler(newItem);
      console.log("newItem", newItem);
      setDescription((ele) => (ele = ""));
      setQuantity((ele) => (ele = 1));
    } catch (error) {
      console.error(error.message);
    }
  };
  const options = Array.from({ length: 20 }, (_, index) => index + 1);
  return (
    <form className="add-form" onSubmit={(event) => submitHandler(event)}>
      <h3>What do you need for your 🥰 trip</h3>
      <select
        onChange={(event) => {
          setQuantity(() => +event.target.value);
          console.log(quantity);
        }}
        value={quantity}
      >
        {options.map((ele, index) => (
          <option key={index} value={ele}>
            {ele}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="item"
        placeholder="item...."
        onChange={(event) => {
          setDescription(event.target.value);
          console.log(description);
        }}
        value={description}
      />
      <button type="submit">ADD</button>
    </form>
  );
}
// ========== PackingList ==========
function PackingList(props) {
  const [sorted, setSorted] = useState("input");
  const sortedHandler = (event) => {
    setSorted(event.target.value);
    if (sorted === "input")
      props.setItems((ele) =>
        ele.sort((a, b) => b.description.length - a.description.length)
      );
    if (sorted === "description")
      props.setItems((ele) =>
        ele.sort((a, b) => a.description.length - b.description.length)
      );
    if (sorted === "packed")
      props.setItems((ele) =>
        ele.sort((a, b) => Number(a.packed) - Number(b.packed))
      );
  };
  const clearItems = () => {
    props.setItems((ele) => (ele = []));
  };
  return (
    <div className="list">
      <ul>
        {props.items.map((ele) => {
          return <TaskItem key={ele.id} ele={ele} setItems={props.setItems} />;
        })}
      </ul>
      <div className="actions">
        <select value={sorted} onChange={(event) => sortedHandler(event)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={() => clearItems()} type="">
          clear
        </button>
      </div>
    </div>
  );
}
// ========== TaskItem ==========
function TaskItem(props) {
  const deleteItemHandler = (itemID) => {
    props.setItems((eles) => eles.filter((ele) => ele.id !== itemID));
  };
  const packedCheckedHandler = (itemID) => {
    props.setItems((eles) =>
      eles.map((ele) =>
        ele.id === itemID ? { ...ele, packed: !ele.packed } : ele
      )
    );
  };

  return (
    <li>
      <input
        type="checkbox"
        name="packed-btn"
        checked={props.ele.packed}
        onChange={() => packedCheckedHandler(props.ele.id)}
      />
      <span style={{ textDecoration: props.ele.packed ? "line-through" : "" }}>
        {props.ele.quantity} {props.ele.description}
      </span>
      <button onClick={() => deleteItemHandler(props.ele.id)}>❌</button>
    </li>
  );
}
// ========== State ==========
function Stats(props) {
  if (props.items.length === 0)
    return (
      <footer className="stats">
        <p>start adding you items at packing list</p>
      </footer>
    );
  const itemsPackedLength = props.items.filter(
    (ele) => ele.packed === true
  ).length;
  const itemsLength = props.items.length;
  const packedPercent =
    Math.floor((itemsPackedLength / itemsLength) * 100) || 0;
  return (
    <footer className="stats">
      <em>
        {packedPercent === 100
          ? "You got everything ready to go 🎉"
          : `You have ${itemsLength} items on your list, and you already packed
        ${itemsPackedLength} (${packedPercent}%)`}
      </em>
    </footer>
  );
}

export default App;
