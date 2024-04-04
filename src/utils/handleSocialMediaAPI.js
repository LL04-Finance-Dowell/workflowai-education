import axios from 'axios';
import React from 'react';
import CryptoJS from 'crypto-js';
import { useStateContext } from '../contexts/contextProvider';

const handleSocialMediaAPI = async (decoded, save = false) => {

  const response = await axios.post("https://uxlivinglab.pythonanywhere.com/", {
    document_id: decoded.details._id,
    action: decoded.details.action,
    database: decoded.details.database,
    collection: decoded.details.collection,
    team_member_ID: decoded.details.team_member_ID,
    function_ID: decoded.details.function_ID,
    cluster: decoded.details.cluster,
    field: { _id: decoded.details._id },
    command: "fetch",
    document: decoded.details.document,
    update_field: decoded.details.update_field,
    platform: "bangalore",
  })

  if (!response.data) {
    toast.error("Something went wrong while fetching data!")
    return;
  }
  if (save == true) {
    const title = document.getElementById("trueTitle")?.innerText;
    const paragraph = document.getElementById("trueParagraph")?.innerText;
    // const image = document.querySelector(".sm-image")?.style?.backgroundImage;
    const image = localStorage.getItem("editor_social_img");

    // if (title == null || paragraph == null || image == null) {
    //   return;
    // }


    const { user_id, session_id, eventId, client_admin_id, qualitative_categorization, targeted_for, designed_for, targeted_category, source, order_nos } = JSON.parse(response.data)?.data[0] //title field
    // console.log("social response", response.data.data);
    // console.log("\n>>>>>>>>>>>>>\nDECODED\n",JSON.parse(response.data)?.data[0],"\n>>>>>>>>>>>>>\n")



    // const socialData = {
    //   cluster: "socialmedia",
    //   database: "socialmedia",
    //   collection: "step4_data",
    //   document: "step4_data",
    //   team_member_ID: "1163",
    //   function_ID: "ABCDE",
    //   command: "insert",
    //   eventId: eventId,
    //   field: {
    //     user_id: user_id,
    //     session_id: session_id,
    //     eventId: eventId,
    //     client_admin_id: client_admin_id,
    //     title: title,
    //     paragraph: paragraph,
    //     source: source,
    //     qualitative_categorization: qualitative_categorization,
    //     targeted_for: targeted_for,
    //     designed_for: designed_for,
    //     targeted_category: targeted_category,
    //     image: image,
    //     date: new Date(),
    //     time: new Date().toISOString(),
    //     status: " "

    //   },
    //   update_field: {
    //     order_nos: order_nos
    //   },
    //   "platform": "bangalore"
    // }

    const postId = decoded.details._id
    const socialData = {
      post_id: postId,
      title: title,
      paragraph: paragraph,
      image: image,
    }

    window.parent.postMessage(socialData, "*");

    console.log("/n>>> Decoded\n", socialData, "\n>>>")
    //       const saveResponse = await axios.post(`https://100007.pythonanywhere.com/edit_post/${postId}/`, socialData);
    //   console.log("save response data", saveResponse);

  } else {
    return response;
  }
};

export default handleSocialMediaAPI;