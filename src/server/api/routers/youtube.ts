import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { TRPCError } from "@trpc/server";
import { youtubeIdeaSchema } from "~/pages/index";

type OpenAITextResponse = {
  videoTitle: string;
  videoDescription: string;
  channelName: string;
};

export type YouTubeIdea = {
  videoTitle: string;
  videoDescription: string;
  channelName: string;
  videoThumbnailURL: string;
};

const getYouTubePrompt = (topics: string[], adjectives: string[], demographic: string) => {
  return `You are YouTubeVideoIdeaGPT, an AI that generates elaborate video ideas about a random subject that involves all of the provided topics and adjectives and uses language appropriate for the target age demographic.

Video Topics: Gaming, How-To.
Video Adjectives: Informative.
Age Demographic: 8-14.
Response:
{"videoTitle":"BEGINNERS guide to SPEEDRUNNING MINECRAFT", "videoDescription":"In this tutorial will show you how to SpeedRun Minecraft as Fast as Possible. I will teach you everything you need to know and some tips and tricks that even the most experienced Minecraft speedrunners will learn something from.\n I've had a bunch of people recently ask me about how to start speedrunning Minecraft so I figured I'd make a comprehensive video tutorial to answer all of the frequently asked questions. The video was already to long so ive missed out plenty of minecraft tips. If you want to see this tips in a separate video let me know in the comments down below.", "channelName":"LiquidCandy"}

Video Topics: Technology, Review.
Video Adjectives: Informative, Funny, Exciting.
Age Demographic: 18-25.
Response:
{"videoTitle":"Ditch Your Favorite Programming Paradigm | Prime Reacts", "videoDescription":"Hey there, fellow coders! Get ready to shake things up in the latest episode of Prime Reacts! We're daring you to ditch your all-time favorite programming paradigm and dive headfirst into the exciting realm of coding possibilities. From functional to object-oriented and everything in between, we're exploring it all! Brace yourself for mind-blowing discussions, epic insights, and loads of laughs as we challenge ourselves to think differently and break free from our comfort zones. Who knows, you might just stumble upon a new coding love affair! Don't miss this exhilarating journey that could reshape your programming path. Subscribe to PrimeTime right now, because trust us, you don't want to miss out on this wild and enlightening ride! Let's code like there's no tomorrow!", "channelName":"ThePrimeTime"}

Video Topics: ${topics.join(", ")}.
Video Adjectives: ${adjectives.join(", ")}.
Age Demographic: ${demographic}.
Response:
;`;
};

export const youtubeRouter = createTRPCRouter({
  generate: publicProcedure
    .input(youtubeIdeaSchema)
    .mutation(async ({ input: { topics, adjectives, demographic } }) => {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const textResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: getYouTubePrompt(topics, adjectives, demographic),
        max_tokens: 300,
        temperature: 0.9,
      });

      const returnText = textResponse.data.choices.at(0)?.text;
      if (!returnText) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }

      const returnObj = JSON.parse(returnText) as OpenAITextResponse;

      const imageResponse = await openai.createImage({
        prompt: returnObj.videoDescription,
        size: "256x256",
      });
      const returnURL = imageResponse.data.data.at(0)?.url;
      if (!returnURL) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }

      return { ...returnObj, videoThumbnailURL: returnURL } as YouTubeIdea;
    }),
});
