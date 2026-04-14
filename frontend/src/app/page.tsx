"use client";
import { Provider } from "react-redux";
import HomePage from "../components/Home/HomePage";
import { store } from "../state/store";

export default function Home() {
  return (
    <Provider store={store}><HomePage/></Provider>
  )
}
