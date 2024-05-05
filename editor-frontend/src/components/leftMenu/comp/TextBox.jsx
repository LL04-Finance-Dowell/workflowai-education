import React, { useState } from "react";
import Axios from "axios";
import { useStateContext } from "../../../contexts/contextProvider";

const dummyData = {
  normal: {
    is_error: false,
    data: [
      [
        {
          _id: "61e50b063623fc65b472e6eb",
          title: "Livinglab did not create wonderful applications.",
          paragraph:
            "When you\u2019re programming in Python, the data you are working with will be stored in a number of If you\u2019re working with text, your data will be stored as a string. But if you\u2019re working with a decimal number, your data will be structured as a float.\r\n\r\nThis is important because each type of data can be manipulated in different ways. Thus, Python needs to store different sorts of data using different data types. There are a number of data types in Python that are used to store data, including numbers, Booleans, and lists.\r\n\r\nIn this article, we will focus on two of these data types: strings and numbers.",
          source:
            "https://careerkarma.com/blog/python-string-to-int/#:~:text=To%20convert%20a%20string%20to,as%20an%20int%20%2C%20or%20integer.",
          subject: "Livinglab",
          dowelltime: "32941222",
          edited: 0,
          eventId: "FB1010000000016424005125815918",
        },
      ],
    ],
    sampling_status: false,
    sampling_status_text: "Not expected",
  },
};

const TextBox = () => {
  const [data, setData] = useState([]);

  const getPostData = async () => {
    const response = await Axios.post(
      "https://100058.pythonanywhere.com/api/get-data-by-collection/",
      {
        cluster: "socialmedia",
        database: "socialmedia",
        collection: "step2_data",
        fields: "_id",
      }
    )
      .then((res) => {
        setData(res.data.normal.data[0]);
      })
      .catch((err) => {});
  };
  getPostData();
  const { handleClicked, setSidebar, setIsResizing } = useStateContext();

  return (
    <>
      {data.map((item) => {
        return (
          <div className="dropped">
            <textarea
              id="txt"
              onClick={() => {
                handleClicked("align2");
                setSidebar(true);
              }}
              name=""
              key={item.id}
            >
              {item.full_name}
            </textarea>
          </div>
        );
      })}
    </>
  );
};

export default TextBox;
