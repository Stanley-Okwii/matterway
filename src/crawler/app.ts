import { getRandomGoodReadsBookTitle } from "./goodReads";
import { addBookToAmazonCart } from "./amazon";

(async () => {
  const randomBookTitle = await getRandomGoodReadsBookTitle();
  await addBookToAmazonCart(randomBookTitle);
})();
