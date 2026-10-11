# AGENTS.md

## What this project is

SelfCP: prompt-compression research code for LLM summarisation / QA / in-context
learning (`DatasetModule.py`, `ModelModuleBlue.py`, `ModelModuleLLama.py`,
`Trainer.py`, driven by `main.py --config <yaml>`). It is a **batch CLI
pipeline, not a web application**: there is no HTTP server anywhere in the
repository, so **nothing listens on port 3000** and the Base44 preview cannot
render this project. An empty preview here is expected, not a broken stack.

## Running it needs things that are not in the repository

`config-blue.yaml` and the source reference assets by absolute path under
`/data1/gj/...`. None of them exist in the repo (an earlier commit deleted the
weight/data archives). To execute the pipeline you need all of:

- **4 CUDA GPUs.** `main.sh` launches via
  `torchrun --nnodes=1 --nproc_per_node=4`, and `config-blue.yaml` sets
  `synced: True`, which runs `torch.distributed.init_process_group(backend='nccl')`.
  Consequences observed in the sandbox (which has no GPU):
  - plain `python main.py --config config-blue.yaml` fails with
    `KeyError: 'LOCAL_RANK'` (it must be launched by `torchrun`);
  - a `torchrun` launch fails because NCCL / CUDA are unavailable.
- **LLM weights**: `/data1/gj/BlueLM` (or `/data1/gj/vicuna-7b-v1.3`,
  `/data1/gj/llama2-7b-chat-hf`).
  Note: `ModelModule*` calls `self.__model.model.seperate_embeddings()`,
  `frozen_embeddings`, `set_trained_embeddings()` and `holder_embeds=` on the
  backbone. Those are **custom modifications of the model code inside the
  weights directory**, loaded via `trust_remote_code=True`. Stock upstream
  BlueLM/Llama code will not work.
- **Datasets**: ~20 JSON files, e.g.
  `/data1/gj/PromptCompression/dataset/duc_test_data.json`, `short_train_data.json`,
  `long_train_data.json`, `val_data.json`.
- **Trained checkpoints**:
  `/data1/gj/PromptCompression/savedModels-multi-blue/Step5/*.pth`.
- **One file loaded unconditionally by `main.py`**, on every action (not just
  training): `/data1/gj/PromptCompression/promptcompressor/promptcompressor_bluelm_duc.json`.

Outputs are also written to hardcoded absolute paths (`/data1/gj/...`), so the
matching directories must exist and be writable.

## Dependencies

The repository ships no manifest; `requirements.txt` was derived from the
imports. Two non-obvious points:

- The PyPI package providing `import fastchat` is **`fschat`**, not `fastchat`
  (the latter is an unrelated old package).
- **`ruamel.yaml` must be < 0.18.** `main.py` uses
  `yaml.load(open(path), Loader=yaml.Loader)`, the legacy API that ruamel.yaml
  removed in 0.18; with 0.18+ the config cannot be parsed at all.
- `transformers<5` and `numpy<2` keep the code's imports (`LlamaTokenizer`,
  etc.) working.

The upstream environment was Python 3.9 (see the committed `__pycache__/`).
The sandbox stack uses Python 3.11, where the code also imports cleanly.

## Sandbox environment (`docker-compose.base44.yml`)

There is no web entry point, so the stack is a single long-running `runtime`
service: `python:3.11-slim`, the repo bind-mounted at `/app`, dependencies
installed from `requirements.txt` at container startup. Use it to work on the
code:

```sh
docker compose -f docker-compose.base44.yml up -d
docker compose -f docker-compose.base44.yml exec runtime python main.py --help
docker compose -f docker-compose.base44.yml exec runtime python main.py --config config-blue.yaml   # needs GPU + assets
```

The compose file resolves `torch` from the CPU wheel index purely because the
sandbox has no GPU; on a GPU host install the default (CUDA) build.

## How to verify the environment

- `docker compose -f docker-compose.base44.yml ps` -> `runtime` is `healthy`.
  The healthcheck imports every dependency the project loads at startup
  (`torch, transformers, fastchat, calflops, ruamel.yaml, tensorboardX, numpy, tqdm`).
- `python -c "import main, Trainer, DatasetModule, ModelModuleBlue, ModelModuleLLama, utils"` -> OK.
- `python main.py --help` -> prints usage (proves the whole import graph resolves).
- Parsing the config is the one *functional* check that works without a GPU:
  `python -c "import ruamel.yaml as yaml; print(yaml.load(open('config-blue.yaml'), Loader=yaml.Loader)['action'])"` -> `baseline`.

Running the actual pipeline is **not** possible in the sandbox (no GPU, no
weights, no datasets); it must run on a GPU host with the assets in place.
