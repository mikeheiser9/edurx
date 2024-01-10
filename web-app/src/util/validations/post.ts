import * as Yup from "yup";
import { forumTypes, postTypes } from "../constant";

const postCreationValidation = Yup.object({
  forumType: Yup.string().oneOf(forumTypes).required(),
  postType: Yup.string().oneOf(postTypes),
  title: Yup.string().required().max(250),
  categories: Yup.array(Yup.string().required()),
  filters: Yup.array(Yup.string().required()),
  isPrivate: Yup.boolean(),
  content: Yup.string().nullable().transform(function(value,originalValue){
    return originalValue.replace(/<\/?[^>]+(>|$)/g, '')
  }).max(5000),
  options: Yup.array().when("postType", {
    is: (type: string) => type === postTypes[1], // Check if postType is "poll"
    then: (schema) =>
      schema.of(Yup.string().required("Option is required field")),
    otherwise: (schema) => schema.of(Yup.string().nullable()),
  }),
  votingLength: Yup.number().when("postType", {
    is: (type: string) => type === postTypes[1],
    then: (schema) => schema.required().min(1),
  }),
});
export { postCreationValidation };

