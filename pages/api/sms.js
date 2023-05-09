export default async function handler(req, res) {
  try {
    const { phoneNumber, unsubscribe } = JSON.parse(req.body);
    const isValidPhoneNumber = phoneNumber.match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    );
    const isPostRequest = req.method === "POST";
    if (!isPostRequest) {
      throw "Invalid request";
    } else if (!isValidPhoneNumber) {
      throw "Invalid phone number";
    }

    const result = await fetch(
      `https://failingpassionatecubase.juandxce1.repl.co/proxiedapi?number=${phoneNumber}${
        unsubscribe ? "&unsubscribe=true" : ""
      }`
    );
    const jsonData = await result.json();

    res.status(200).json({ result: jsonData });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could't process your request", message: err });
  }
}
