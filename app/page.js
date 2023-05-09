"use client";

import styles from "./page.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleSubscription = (payload) => {
  return fetch("http://localhost:3000/api/sms", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => {
    return response.json();
  });
};

const handleNotification = (payload) => {
  if (
    payload.result?.subscribedMessage ||
    payload.result?.unsubscribedMessage
  ) {
    const message =
      payload.result?.subscribedMessage || payload.result?.unsubscribedMessage;
    toast.success(message);
  } else if (payload.result?.alreadySubscribedMessage) {
    toast.warning(payload.result?.alreadySubscribedMessage);
  } else if (payload.error) {
    toast.error(payload.message || payload.error);
  }
};

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastResponse, setLastResponse] = useState();
  const canUnsubscribe =
    lastResponse?.result?.alreadySubscribedMessage ||
    lastResponse?.result?.subscribedMessage;
  const DiscountCode = lastResponse?.result?.discountCode;
  const copyDCode = () => {
    navigator.clipboard.writeText(DiscountCode);
    toast.success("Code copied to clipboard");
  }

  const handleSubscribe = async () => {
    const data = await handleSubscription({ phoneNumber });
    setLastResponse(data);
    handleNotification(data);
  };

  const handleUnsubscribe = async () => {
    const data = await handleSubscription({ phoneNumber, unsubscribe: true });
    setLastResponse(data);
    handleNotification(data);
  };

  return (
    <main className={styles.main}>
      <TextField
        id="outlined-controlled"
        label="Phone Number"
        value={phoneNumber}
        onChange={(event) => {
          setPhoneNumber(event.target.value);
          setLastResponse();
        }}
      />
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSubscribe}>
          Subscribe
        </Button>
        {canUnsubscribe && (
          <>
            <Button variant="outlined" onClick={handleUnsubscribe}>
              opt-out
            </Button>
            <Button
              variant="outlined"
              onClick={copyDCode}
            >
              Copy code
            </Button>
          </>
        )}
      </Stack>
      <ToastContainer />
    </main>
  );
}
