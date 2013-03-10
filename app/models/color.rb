class Color < ActiveRecord::Base
  attr_accessible :name, :hex

  has_and_belongs_to_many :colors
  has_many :blocks
end
