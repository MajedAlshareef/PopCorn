import { useEffect } from "react";

export function useKey(key, action) {
  //you can do this or do toLowerCase() in the condition
  //   key = key[0].toUpperCase() + key.slice(1).toLowerCase();
console.log(action)
  useEffect(() => {
    function callBack(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action?.();
      }
    }

    document.addEventListener("keydown", callBack);

    return () => document.removeEventListener("keydown", callBack);
  }, [key, action]);
}
