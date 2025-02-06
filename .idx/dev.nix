{ pkgs ? import <nixpkgs> {} }:

let
  poetry2nix = pkgs.poetry2nix;
in
pkgs.mkShell {
  buildInputs = [
    (poetry2nix.mkPoetryEnv { projectDir = ./.; })
    pkgs.nodejs_20  # if your project needs Node.js
  ];

  shellHook = ''
    echo "Development environment is ready with Python and google-generative-ai installed."
  '';
}
