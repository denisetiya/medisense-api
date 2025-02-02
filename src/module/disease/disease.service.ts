import isError from "../../utils/handle.error";
import { iDesease } from "../../types/disease";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default class DiseaseService {
  static async getDiseaseDrug(data: iDesease) {
    try {
      const result = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Give me a recommendation for the right medication for the disease *${data.name}* with a medical history of *${data.history}* in JSON format. The output format must be an array of objects with 'drugName' , 'dosis' , 'duration', 'note', 'label' (label of the type of medicine, e.g. Over-the-counter or prescription only), 'sideEffects'  without any other words, please response in json dont include (like '''json or etc ) and using english language, if the text inside *text* does not match the pattern give return text "No Information Found"`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 700,
        response_format :{"type": "json_object"},
      });

      if (!result) {
        throw isError({ status: 400, message: "failed get analytics" });
      }

      const content = result.choices[0]?.message.content;


      if (content) {
        try {
          const jsonData = JSON.parse(content);
          return jsonData;
        } catch (error) {
          console.error("Error parsing JSON:", error);

          try {
            const jsonData = JSON.parse(`[${content}]`);
            return jsonData;
          } catch (error2) {
            console.error("Error parsing JSON (alt):", error2);
            return content;
          }
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return isError(error);
    }
  }

  static async getDiseaseInformation(name: string) {
    try {
      const result = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Give me information about the disease *${name}* in JSON format. The output format must be a JSON object with 'commonSymptoms[]' , 'reason[]' , 'recommendedTreatment[]' and 'prevention[]' properties without any other words and using english language, if the text inside *text* does not match the pattern give return text "No Information Found"`,
         
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        stream: false,

        max_tokens: 2000,
        response_format :{"type": "json_object"},
        
      });

      if (!result) {
        throw isError({ status: 400, message: "failed get analytics" });
      }

      const content = result.choices[0]?.message.content;


      if (content) {
        try {
          const jsonData = JSON.parse(content);
          return jsonData;
        } catch (error) {
          console.error("Error parsing JSON:", error);

          try {
            const jsonData = JSON.parse(`[${content}]`);
            return jsonData;
          } catch (error2) {
            console.error("Error parsing JSON (alt):", error2);
            return content;
          }
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return isError(error);
    }
  }
}


