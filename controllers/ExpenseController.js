//Validation for Past or Present Date (Restrict Future Entries)
const currentDate = new Date();
const entryDate = new Date(req.body.date_time);

if (entryDate > currentDate) {
    return res.status(400).json({ error: "Date cannot be in the future." });
}
//Ensure Category is Selected
if (!req.body.category_id) {
    return res.status(400).json({ error: "Category is required." });
}
