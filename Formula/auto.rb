class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.39.1/auto-macos.gz"
  version "v10.39.1"
  sha256 "4a28da8c7aa50da86030e7a026a04fa7fc344de0faf6a4df64a92488fa37415d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end