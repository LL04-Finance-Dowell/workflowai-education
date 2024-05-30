import { useState, useEffect } from "react";
import { CircularProgress, Modal } from "@mui/material";
import { DatabaseServices } from "../../services/appServices";
import { useSelector } from "react-redux";
import { productName } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import styles from "./intinalConfig.module.css";

const InitialCongiguration = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dbService = new DatabaseServices();

  useEffect(() => {
    console.log(
      "workspace_id " + userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
        : userDetail?.portfolio_info[0].org_id
    );
    setLoading(true);
    dbService
      .getDatabaseServices(
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0].org_id
      )
      .then((res) => {
        console.log(res?.data);
        navigate("/");
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.modal}>
        {loading ? (
          <div>
            <CircularProgress size={20} />{" "}
            <span style={{ marginLeft: 5 }}> Loading ...</span>
          </div>
        ) : (
          <div>{errMsg} </div>
        )}
      </div>
    </>
  );
};

export default InitialCongiguration;
