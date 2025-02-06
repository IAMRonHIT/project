{ pkgs ? import <nixpkgs> {} }:

let
  myPythonEnv = pkgs.python3.withPackages (ps: with ps; [
    google-generativeai
  ]);
in
pkgs.mkShell {
  buildInputs = [
    myPythonEnv
    pkgs.nodejs_20
  ];

  # Optional: if you want to set PYTHONPATH or any other env vars
  shellHook = ''
    echo "Python environment with google-generativeai is ready!"
  '';
}
