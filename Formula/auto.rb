class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.60.1/auto-macos.gz"
  version "v9.60.1"
  sha256 "31341a8ddc883592ea17d4ccaf19b5cc9e1284042112e1d5a7cb453ad1fd23ed"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end