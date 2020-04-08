class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.26.8/auto-macos.gz"
  version "v9.26.8"
  sha256 "7a203755fe87100b3c5a7dd0fd7c54a2769ab4c0e2843ebab08356d42d8a9d47"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end