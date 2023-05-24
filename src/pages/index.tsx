import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { z } from "zod";
import { useState } from "react";
import { type YouTubeIdea } from "~/server/api/routers/youtube";
import Image from "next/image";

const youtubeTopics = [
  "Music",
  "Fashion",
  "Unboxing",
  "Art",
  "Business",
  "How-To",
  "Education",
  "Gaming",
  "Review",
  "Technology",
];

const youtubeAdjectives = ["Funny", "Serious", "Creative", "Informative", "Exciting"];

const youtubeDemographics = ["4-10", "10-18", "18-28", "28-40", "40-55", "55-72", "72+"];

export const youtubeIdeaSchema = z.object({
  topics: z.array(z.string()).refine((val) => val.length > 0 && val.length < 4),
  adjectives: z.array(z.string()).refine((val) => val.length > 0 && val.length < 4),
  demographic: z.string().min(1).max(5),
});

type YouTubeIdeaSchema = z.infer<typeof youtubeIdeaSchema>;

// export const sampleYoutubeResponse = {
//   channelName: "MovieMashup",
//   videoDescription: `Do you have what it takes to create the ultimate movie mashup? In this video, you'll take clips from different movies and combine them into a single masterpiece. You'll have to be creative and think outside the box to make it work. Will you be able to make a movie mashup that everyone will love? Find out in this video!`,
//   videoThumbnailURL:
//     "https://oaidalleapiprodscus.blob.core.windows.net/private/org-xWG1DUvbA9Ejd0dZCXhPfHO4/user-sflEvR1IwPOxaEzByAeiFoas/img-v6LpEydkZtqrpKbUeWAf1dP9.png?st=2023-05-20T22%3A04%3A34Z&se=2023-05-21T00%3A04%3A34Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-20T11%3A03%3A23Z&ske=2023-05-21T11%3A03%3A23Z&sks=b&skv=2021-08-06&sig=afIa82mRnvBtSnadSew%2B1rz4lbQO114jOgHSbcbLkns%3D",
//   videoThumbnailDescription: "Movie Mashup",
//   videoTitle: "Movie Mashup",
// };

const YouTubeIdeaGenerator: NextPage = () => {
  const [videoIdea, setVideoIdea] = useState<YouTubeIdea | null>(null);

  const [selectedTopics, setSelectedTopics] = useState<Array<string>>([]);
  const [selectedAdjectives, setSelectedAdjectives] = useState<Array<string>>([]);
  const [selectedDemographic, setSelectedDemographic] = useState<string>("");
  const [errors, setErrors] = useState<{
    topics?: string[] | undefined;
    adjectives?: string[] | undefined;
    demographic?: string[] | undefined;
  }>({});

  const { mutate, isLoading } = api.youtube.generate.useMutation({
    onSuccess(data) {
      setVideoIdea(data);
    },
  });

  const handleSubmit = (input: YouTubeIdeaSchema) => {
    const result = youtubeIdeaSchema.safeParse(input);
    if (result.success) {
      setErrors({});
      setVideoIdea(null);
      mutate(input);
    } else {
      setErrors(result.error.flatten().fieldErrors);
      console.log(result.error.flatten().fieldErrors);
    }
  };

  const submitDisabled = isLoading;
  return (
    <>
      <Head>
        <title>YouTube Idea Generator</title>
        <meta
          name="description"
          content="Generate novel YouTube video ideas by selecting a few topics, adjectives and an age demographic."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-8">
        <div className="mx-auto max-w-[800px]">
          <h1 className="text-3xl">YouTube Idea Generator</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit({
                topics: selectedTopics,
                adjectives: selectedAdjectives,
                demographic: selectedDemographic,
              });
            }}
            className="px-4 pb-2 pt-4"
          >
            <p className="text-xl">Video Topics</p>
            <p className="font-light">Choose up to 3</p>
            <div className="gap-2 md:flex md:flex-wrap">
              {youtubeTopics.map((topic) => {
                const selected = selectedTopics.includes(topic);
                return (
                  <button
                    type="button"
                    className={`mt-4 rounded-full px-4 py-2 font-light transition-colors ${
                      selected ? "bg-slate-400" : "bg-slate-100"
                    }`}
                    key={topic}
                    onClick={() => {
                      if (selected) {
                        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                      } else if (selectedTopics.length < 3) {
                        setSelectedTopics([...selectedTopics, topic]);
                      }
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            {errors?.topics && (
              <div className="flex w-full justify-end">
                <p className="mt-2 font-light text-red-500">Choose between 1 and 3 topics</p>
              </div>
            )}
            <p className="mt-4 text-xl">Video Adjectives</p>
            <p className="font-light">Choose up to 3</p>
            <div className="gap-2 md:flex md:flex-wrap">
              {youtubeAdjectives.map((adjective) => {
                const selected = selectedAdjectives.includes(adjective);
                return (
                  <button
                    type="button"
                    className={`mt-4 rounded-full px-4 py-2 font-light transition-colors ${
                      selected ? "bg-slate-400" : "bg-slate-100"
                    }`}
                    key={adjective}
                    onClick={() => {
                      if (selected) {
                        setSelectedAdjectives(selectedAdjectives.filter((a) => a !== adjective));
                      } else if (selectedAdjectives.length < 3) {
                        setSelectedAdjectives([...selectedAdjectives, adjective]);
                      }
                    }}
                  >
                    {adjective}
                  </button>
                );
              })}
            </div>
            {errors?.adjectives && (
              <div className="flex w-full justify-end">
                <p className="mt-2 font-light text-red-500">Choose between 1 and 3 adjectives</p>
              </div>
            )}
            <p className="mt-4 text-xl">Age Demographic</p>
            <p className="font-light">Choose 1</p>
            <div className="gap-2 md:flex md:flex-wrap">
              {youtubeDemographics.map((demographic) => {
                const selected = demographic === selectedDemographic;
                return (
                  <button
                    type="button"
                    className={`mt-4 rounded-full px-4 py-2 font-light transition-colors ${
                      selected ? "bg-slate-400" : "bg-slate-100"
                    }`}
                    key={demographic}
                    onClick={() => {
                      setSelectedDemographic(demographic);
                    }}
                  >
                    {demographic}
                  </button>
                );
              })}
            </div>
            {errors?.demographic && (
              <div className="flex w-full justify-end">
                <p className="mt-2 font-light text-red-500">Choose 1 age demographic</p>
              </div>
            )}
            <div className="flex w-full justify-end">
              <button
                type="submit"
                disabled={submitDisabled}
                className={`mt-4 rounded-full bg-slate-300 px-4 py-2 hover:bg-slate-400 active:bg-slate-500 ${
                  submitDisabled ? "opacity-50" : ""
                }`}
              >
                {isLoading ? "Generating" : "Generate"}
              </button>
            </div>
          </form>
          {videoIdea && (
            <div className="mt-8">
              <Image
                src={videoIdea.videoThumbnailURL}
                width={800}
                height={500}
                className="h-full max-h-[500px] w-full max-w-[800px]"
                alt={videoIdea.videoTitle}
              />
              <p className="mt-4 text-3xl">{videoIdea.videoTitle}</p>
              <p className="text-slate-600">{videoIdea.channelName}</p>
              <div className="mt-2 rounded-md bg-slate-200 p-2">
                <p>{videoIdea.videoDescription}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default YouTubeIdeaGenerator;
