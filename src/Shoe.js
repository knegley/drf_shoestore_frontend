import React, { useState, useEffect, Fragment, useCallback } from "react";
import { v4 } from "uuid";
const Shoe = (props) => {
  const [shoes, setShoes] = useState(null);

  let shoeDetailUrl = "http://127.0.0.1:8001/api/shoe/shoe_detail/";

  const dispatcher = useCallback(
    (output) => setShoes(() => [...output, output]),
    []
  );

  useEffect(() => {
    try {
      (async () => {
        let output = [];
        const response = await fetch(shoeDetailUrl);
        const shoe_data = await response.json();
        // console.log(shoe_data);
        shoe_data.forEach(async (value) => {
          // console.log(value);
          let { color, shoe_type, manufacturer } = value;
          // console.log(color, shoe_type, manufacturer);
          let dataToFetch = [color, shoe_type, manufacturer];
          let test = await Promise.all(
            dataToFetch.map(async (url) => {
              const r = await fetch(url);
              const d = await r.json();
              const data = d.color ?? d.style ?? d.name ?? "none";

              return data;
            })
          );
          // console.log(test);

          let result = {
            ...value,
            ...{ color: test[0], shoe_type: test[1], manufacturer: test[2] },
          };
          output = [...output, result];

          dispatcher(output);
        });
      })();
    } catch (error) {
      console.error(error);
    }
  }, [dispatcher, shoeDetailUrl]);

  const shoeDetail =
    (shoes ?? null) &&
    shoes.slice(0, shoes.length - 1).map((value, index) => (
      <Fragment key={v4()}>
        <ul>
          <li>Manufactuer:{value.manufacturer} </li>
          <li>Brand:{value.brand_name}</li>
          <li>Color: {value.color}</li>
          <li>Material: {value.material}</li>
          <li>Type:{value.shoe_type}</li>
        </ul>
      </Fragment>
    ));

  return (
    <Fragment>
      <div>Shoes</div>
      {shoeDetail}
    </Fragment>
  );
};

export default Shoe;
