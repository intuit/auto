class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.3.7/auto-macos.gz"
  version "v11.3.7"
  sha256 "842d2655fe5f8a3f225e4dd94f3948fb4e66e75e77d635ec0f35dde27f6f7b05"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end