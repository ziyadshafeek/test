!pip install cohere
import cohere
co = cohere.Client('mTeiGiDIpi4R7perkfRnMnCmi5jJzM8QziDVPrG8') # This is your trial API key
response = co.generate(
  model='9b2e329d-7542-4c44-8f8c-cac03a6c4f5a-ft',
  prompt='enzyme deficient in pompe\'s disease',
  max_tokens=708,
  temperature=0,
  k=0,
  stop_sequences=[],
  return_likelihoods='NONE')
print('Prediction: {}'.format(response.generations[0].text))
