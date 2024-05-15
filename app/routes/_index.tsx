import { ActionFunctionArgs, json, type MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from '@remix-run/react';
import { useState } from 'react';
import Replicate from 'replicate';

interface FetcherData {
  prompt: string;
  output: string[];
}

export const meta: MetaFunction = () => {
  return [
    { title: 'AI App' },
    { name: 'description', content: 'Testing AI API features' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const prompt = formData.get('prompt');

  const replicate = new Replicate({
    auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
  });

  const output = await replicate.run(
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    {
      input: {
        prompt,
        width: 768,
        height: 768,
        refine: 'expert_ensemble_refiner',
        apply_watermark: false,
        num_inference_steps: 25,
      },
    }
  );

  return json({ prompt: prompt, output: output });
};

export default function Index() {
  const fetcher = useFetcher<FetcherData>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    fetcher.data && setLoading(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-16">AI App - Image Generation</h1>
      <div>
        <fetcher.Form
          method="post"
          action="/?index"
          className="flex flex-col gap-y-3 w-1/2"
        >
          <label htmlFor="prompt" className="text-lg">
            ___Prompt___
          </label>
          <textarea
            name="prompt"
            id="prompt"
            placeholder="enter prompt here... e.g. a cat wearing a hat while sat on a mat"
            rows={7}
            maxLength={350}
            className="border border-black ml-4 p-2 resize-none"
          />
          <div className="mb-4">
            <button
              type="submit"
              className="border border-black hover:border-gray-400 ml-4 py-1 px-2"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </fetcher.Form>

        {loading && !fetcher.data && <pre>generating image...</pre>}

        {fetcher.data && (
          <div>
            <h2 className="text-lg mb-4">___Result___</h2>
            <div className="ml-4">
              <img
                src={fetcher.data.output[0]}
                alt={fetcher.data.prompt}
                width={400}
                height={400}
              />
              <small>
                image generated using Stable Diffusion. defaults dimensions are
                768x768.
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>the stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
