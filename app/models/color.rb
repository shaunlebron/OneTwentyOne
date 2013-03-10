class Color < ActiveRecord::Base
  attr_accessible :name, :hex

  has_and_belongs_to_many :users
  has_many :blocks
end
