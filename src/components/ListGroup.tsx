import { useState } from "react";

function ListGroup() {
  let items = [
    'Mona Lisa',
    'Scream',
    'Starry Night',
    'Frida Kahlo'
  ];

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const message = items.length === 0 ? <p>No item found</p> : null;

  return (
    <>
      <h1>List of Art</h1>
      {message}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'}
            key={item}
            onClick={() => { setSelectedIndex(index); }}
          >
            {item}  {/* Display the artwork name */}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
