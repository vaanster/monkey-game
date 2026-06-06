// Single source of truth for carousel artifacts.
// To swap an image: drop a new file in src/assets/artifacts/ and update the import below.
import artifact01 from "@/assets/artifacts/artifact-01.png";
import artifact02 from "@/assets/artifacts/chef_avatar.png";
import artifact03 from "@/assets/artifacts/artifact-03.png";
import artifact04 from "@/assets/artifacts/artifact-04.png";
import artifact05 from "@/assets/artifacts/artifact-05.png";

export type Artifact = {
  id: string;
  title: string;
  image: string;
  /** Image shown inside the pop-up (tall portrait card). Defaults to `image` if omitted. */
  detailImage: string;
  caption: string;
  lore: string;
  /** If true, the slot stays locked until revealed (e.g. by a correct answer). */
  hidden?: boolean;
};

export const artifacts: Artifact[] = [
  {
    id: "01",
    title: "The Eyeful Key",
    image: artifact01,
    detailImage: artifact01,
    caption: "Found tangled in a clockmaker's hair.",
    lore: "It blinks when you aren't looking. Three of the wards turn left, one turns right — and the last one giggles.",
  },
  {
    id: "02",
    title: "The Crooked Cottage",
    image: artifact02,
    detailImage: artifact02,
    caption: "A polaroid that refuses to dry.",
    lore: "The windows light up at the same hour each evening, even when the photo is locked in a drawer. Someone's home.",
  },
  {
    id: "03",
    title: "The Moonlit Watch",
    image: artifact03,
    detailImage: artifact03,
    caption: "Tick, tock — almost.",
    lore: "It keeps the wrong time on purpose. Wind it backwards twice and it'll whisper a number you weren't supposed to hear.",
  },
  {
    id: "04",
    title: "The Whistling Inkwell",
    image: artifact04,
    detailImage: artifact04,
    caption: "Smells faintly of plums.",
    lore: "Dip a quill and it writes the truth. Dip a finger and it writes a wish. Don't ask what the smoke writes.",
  },
  {
    id: "05",
    title: "The Star-Eyed Moon",
    image: artifact05,
    detailImage: artifact05,
    caption: "Mask of a forgotten festival.",
    lore: "Worn once a year by the town's smallest child. The cracks have always been there. So have the eyes.",
  },
  {
    id: "06",
    title: "???",
    image: artifact05,
    detailImage: artifact05, // placeholder; revealed image will replace this later
    caption: "This slot is sealed.",
    lore: "Something is missing. Someone knows the answer.",
    hidden: true,
  },
];
